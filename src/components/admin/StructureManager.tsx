import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, User, GitFork, X, GripHorizontal, GripVertical, Sidebar, Type, UserSquare } from 'lucide-react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface ManagementMember {
    id: string;
    name: string;
    position_id: string;
    image_url: string;
}

interface OrgNode {
    id: string;
    management_id?: string | null;
    custom_title?: string;
    custom_position?: string;
    parent_id: string | null;
    sort_order: number;
    line_type: 'solid' | 'dotted';
    layout_type: 'standard' | 'staff_right';
    member?: ManagementMember;
    children?: OrgNode[];
}

const StructureManager: React.FC = () => {
    const [nodes, setNodes] = useState<OrgNode[]>([]);
    const [members, setMembers] = useState<ManagementMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Add Node Form States
    const [nodeType, setNodeType] = useState<'personnel' | 'custom'>('personnel');
    const [lineType, setLineType] = useState<'solid' | 'dotted'>('solid');
    const [layoutType, setLayoutType] = useState<'standard' | 'staff_right'>('standard');
    const [customTitle, setCustomTitle] = useState('');
    const [customPosition, setCustomPosition] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [orgRes, mgmtRes] = await Promise.all([
                supabase.from('org_structure').select('*').order('sort_order'),
                supabase.from('management').select('id, name, position_id, image_url').eq('is_active', true)
            ]);

            if (orgRes.error) throw orgRes.error;
            if (mgmtRes.error) throw mgmtRes.error;

            setMembers(mgmtRes.data || []);

            // Build Tree
            const rawNodes = orgRes.data || [];
            const tree = buildTree(rawNodes, mgmtRes.data || []);
            setNodes(tree);
        } catch (error) {
            console.error('Error fetching structure:', error);
        } finally {
            setLoading(false);
        }
    };

    const buildTree = (rawNodes: any[], members: ManagementMember[]): OrgNode[] => {
        const nodeMap = new Map<string, OrgNode>();
        const tree: OrgNode[] = [];

        // Initialize nodes with member data
        rawNodes.forEach(node => {
            const member = node.management_id ? members.find(m => m.id === node.management_id) : undefined;
            nodeMap.set(node.id, { ...node, member, children: [] });
        });

        // Build hierarchy
        rawNodes.forEach(node => {
            const mappedNode = nodeMap.get(node.id)!;
            if (node.parent_id && nodeMap.has(node.parent_id)) {
                const parent = nodeMap.get(node.parent_id)!;
                parent.children?.push(mappedNode);
                // Sort children by sort_order
                parent.children?.sort((a, b) => a.sort_order - b.sort_order);
            } else {
                // Root node (or orphan)
                if (!node.parent_id) {
                    tree.push(mappedNode);
                }
            }
        });

        return tree.sort((a, b) => a.sort_order - b.sort_order);
    };

    const handleAddNode = async (managementId?: string) => {
        try {
            const payload: any = {
                parent_id: selectedParentId,
                sort_order: 0,
                line_type: lineType,
                layout_type: layoutType
            };

            if (nodeType === 'personnel' && managementId) {
                payload.management_id = managementId;
            } else if (nodeType === 'custom') {
                payload.custom_title = customTitle;
                payload.custom_position = customPosition;
                payload.management_id = null;
            } else {
                return;
            }

            const { error } = await supabase.from('org_structure').insert(payload);

            if (error) throw error;
            fetchData();
            setIsModalOpen(false);
            resetForm();
            toast.success('Node added to structure');
        } catch (error: any) {
            console.error('Error adding node:', error);
            toast.error(error.message || 'Error adding node');
        }
    };

    const resetForm = () => {
        setLineType('solid');
        setLayoutType('standard');
        setNodeType('personnel');
        setCustomTitle('');
        setCustomPosition('');
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const { error } = await supabase.from('org_structure').delete().eq('id', deleteId);
            if (error) throw error;
            fetchData();
            setDeleteId(null);
            toast.success('Node removed from structure');
        } catch (error: any) {
            console.error('Error deleting node:', error);
            toast.error(error.message || 'Failed to delete');
        }
    };

    const TreeNode = ({ node, isRoot }: { node: OrgNode; isRoot: boolean }) => {
        // Render check: must have either member or custom title
        const displayTitle = node.member?.name || node.custom_title;
        const displayPosition = node.member?.position_id || node.custom_position;
        const isCustom = !node.member;

        if (!displayTitle && !displayPosition) return null;

        const standardChildren = node.children?.filter(c => c.layout_type !== 'staff_right') || [];
        const staffChildren = node.children?.filter(c => c.layout_type === 'staff_right') || [];

        const staffHeight = staffChildren.length > 0 ? (staffChildren.length * 90) + 40 : 0;

        return (
            <li className="relative p-4 pt-12 text-center list-none basis-auto shrink-0 grow-0 align-top">
                <div
                    className={`relative inline-flex flex-col items-center z-10 node-wrapper ${node.line_type === 'dotted' ? 'is-dotted' : 'is-solid'} ${isRoot ? 'is-root' : ''}`}
                    style={{ marginBottom: staffHeight > 0 ? `${staffHeight}px` : undefined }}
                >
                    {/* Vertical Bridge Line (Custom for Staff Gap) - Replaces default line */}
                    {staffHeight > 0 && (
                        <div
                            className="absolute left-1/2 -translate-x-[1px] w-[2px] bg-slate-300 pointer-events-none"
                            style={{ height: `${staffHeight + 20}px`, bottom: `-${staffHeight + 20}px`, zIndex: 0 }}
                        ></div>
                    )}

                    {/* Horizontal Connector Line for Staff (Rendered visible behind the card) */}
                    {staffChildren.length > 0 && (
                        <div className="absolute top-1/2 left-1/2 w-[140px] border-t-2 border-dotted border-slate-400 z-0"></div>
                    )}

                    {/* Content Area: Card + Invisible Spacer for Staff Width */}
                    <div className="relative flex items-start justify-center z-20">
                        {/* The spacer forces the container to be wide enough so siblings don't overlap the absolute staff node */}
                        {staffChildren.length > 0 && <div className="w-[450px] h-1 shrink-0"></div>}

                        {/* Actual Node Card (Centered absolutely if spacer is present to maintain tree alignment, else relative) */}
                        <div className={staffChildren.length > 0 ? "absolute left-1/2 -translate-x-1/2 top-0" : "relative"}>
                            {isCustom ? (
                                // CUSTOM TEXT-ONLY CARD
                                <div className={`p-4 rounded-xl shadow-md border bg-white flex flex-col items-center justify-center gap-1 min-w-[180px] max-w-[220px] transition-all relative group z-20
                                ${selectedParentId === node.id ? 'border-cyan-500 ring-4 ring-cyan-100' : 'border-slate-300 hover:border-cyan-400'}
                            `}>
                                    <h5 className="font-bold text-slate-900 text-sm leading-tight">{displayTitle}</h5>
                                    {displayPosition && (
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-tight">{displayPosition}</p>
                                    )}

                                    {/* Hover Actions */}
                                    <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedParentId(node.id); setIsModalOpen(true); }} className="p-1.5 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-cyan-500"><Plus size={14} /></button>
                                        <button onClick={() => setDeleteId(node.id)} className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ) : (
                                // STANDARD PHOTO CARD
                                <div className={`p-4 rounded-2xl shadow-xl border bg-white flex flex-col items-center gap-2 min-w-[200px] max-w-[240px] transition-all relative group z-20
                                ${selectedParentId === node.id ? 'border-cyan-500 ring-4 ring-cyan-100' : 'border-slate-200 hover:border-cyan-400'}
                            `}>
                                    <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden shrink-0 shadow-inner border border-slate-100">
                                        {node.member?.image_url ? (
                                            <img src={node.member.image_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={24} /></div>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <h5 className="font-extrabold text-slate-900 text-sm leading-tight mb-1">{displayTitle}</h5>
                                        <div className={`h-0 border-t w-8 mx-auto my-2 ${node.line_type === 'dotted' ? 'border-dotted border-cyan-500 border-t-4' : 'border-solid border-cyan-500 border-t-2'}`}></div>
                                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider leading-tight line-clamp-2">{displayPosition}</p>
                                    </div>

                                    <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedParentId(node.id); setIsModalOpen(true); }} className="p-1.5 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-cyan-500"><Plus size={14} /></button>
                                        <button onClick={() => setDeleteId(node.id)} className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* STAFF / SIDE NODES RENDER */}
                    {staffChildren.length > 0 && (
                        <div className="absolute left-1/2 top-full ml-[1px] flex items-start z-0 pointer-events-none">

                            {/* Staff Box Container */}
                            <div className="absolute top-[20px] left-[140px] flex flex-col gap-3 p-3 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/80 backdrop-blur-sm pointer-events-auto min-w-[240px]">
                                {staffChildren.map(staff => {
                                    const staffTitle = staff.member?.name || staff.custom_title;
                                    const staffPos = staff.member?.position_id || staff.custom_position;

                                    return (
                                        <div key={staff.id} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 relative group hover:border-cyan-300 transition-colors w-full">
                                            {/* Staff Image or Icon */}
                                            {staff.member ? (
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                    {staff.member.image_url ? (
                                                        <img src={staff.member.image_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={16} /></div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="hidden"></div>
                                            )}

                                            <div className={`text-left min-w-0 flex-1 ${!staff.member ? 'text-center' : ''}`}>
                                                <h6 className="font-bold text-slate-900 text-[10px] leading-tight break-words">{staffTitle}</h6>
                                                {staffPos && <p className="text-[8px] uppercase font-bold text-slate-500 truncate leading-tight mt-0.5">{staffPos}</p>}
                                            </div>
                                            <button onClick={() => setDeleteId(staff.id)} className="absolute right-1 top-1 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {standardChildren.length > 0 && (
                    <ul className="flex justify-center relative pt-4 gap-4">
                        {standardChildren.map(child => (
                            <TreeNode key={child.id} node={child} isRoot={false} />
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="p-8 bg-slate-50/50 rounded-3xl min-h-[700px] border border-dashed border-slate-200 overflow-hidden flex flex-col">
            <style>{`
                /* CSS Tree Styles */
                .org-tree ul { padding-top: 20px; position: relative; transition: all 0.5s; display: flex; justify-content: center; }
                .org-tree li { float: left; text-align: center; list-style-type: none; position: relative; padding: 20px 10px 0 10px; transition: all 0.5s; }
                .org-tree li::before, .org-tree li::after { content: ''; position: absolute; top: 0; right: 50%; border-top: 2px solid #cbd5e1; width: 50%; height: 20px; z-index: 0; }
                .org-tree li::after { right: auto; left: 50%; border-left: 2px solid #cbd5e1; }
                .org-tree li:only-child::after, .org-tree li:only-child::before { display: none; }
                .org-tree li:only-child { padding-top: 0;}
                .org-tree li:first-child::before, .org-tree li:last-child::after { border: 0 none; }
                .org-tree li:last-child::before{ border-right: 2px solid #cbd5e1; border-radius: 0 10px 0 0; }
                .org-tree li:first-child::after{ border-radius: 10px 0 0 0; }
                .org-tree ul ul::before { content: ''; position: absolute; top: 0; left: 50%; border-left: 2px solid #cbd5e1; width: 0; height: 20px; transform: translateX(-50%); }
                .node-wrapper::before { content: ''; position: absolute; top: -20px; left: 50%; border-left: 2px solid #cbd5e1; width: 0; height: 20px; transform: translateX(-50%); z-index: 0; }
                .node-wrapper.is-root::before { display: none !important; }
                .node-wrapper.is-dotted::before { border-left-style: dotted; border-left-width: 4px; }
            `}</style>

            <div className="mb-8 flex justify-between items-center sticky left-0 z-50">
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase italic">Visual Hierarchy</h3>
                    <p className="text-xs text-slate-500">Auto-generated organization chart based on parent-child relations</p>
                </div>
                {nodes.length === 0 && (
                    <button onClick={() => { setSelectedParentId(null); setIsModalOpen(true); }} className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 hover:bg-cyan-600">
                        <Plus size={16} className="inline mr-2" /> Start Root Node
                    </button>
                )}
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing border border-slate-100 rounded-3xl bg-slate-50/30 p-10 tree-container w-full">
                <div className="org-tree min-w-max mx-auto px-20 pb-20 pt-10">
                    <ul className="flex flex-row justify-center">
                        {nodes.map(node => (
                            <TreeNode key={node.id} node={node} isRoot={true} />
                        ))}
                    </ul>
                </div>
            </div>

            {/* Select Member Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900 uppercase italic">Add Node</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Line Style</h4>
                                <div className="flex gap-2">
                                    <button onClick={() => setLineType('solid')} className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center ${lineType === 'solid' ? 'border-cyan-500 bg-white' : 'border-transparent'}`}><GripVertical size={16} /></button>
                                    <button onClick={() => setLineType('dotted')} className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center ${lineType === 'dotted' ? 'border-cyan-500 bg-white' : 'border-transparent'}`}><GripHorizontal size={16} /></button>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Layout</h4>
                                <div className="flex gap-2">
                                    <button onClick={() => setLayoutType('standard')} className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 ${layoutType === 'standard' ? 'border-cyan-500 bg-white text-cyan-600' : 'border-transparent text-slate-400'}`}><GitFork size={16} className="rotate-180" /><span className="text-[10px] font-bold uppercase">Down</span></button>
                                    <button onClick={() => setLayoutType('staff_right')} className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 ${layoutType === 'staff_right' ? 'border-cyan-500 bg-white text-cyan-600' : 'border-transparent text-slate-400'}`}><Sidebar size={16} className="rotate-180" /><span className="text-[10px] font-bold uppercase">Side</span></button>
                                </div>
                            </div>
                        </div>

                        {/* Node Type Tabs */}
                        <div className="mb-4 border-b border-slate-200 flex gap-6">
                            <button onClick={() => setNodeType('personnel')} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${nodeType === 'personnel' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                Select Personnel
                            </button>
                            <button onClick={() => setNodeType('custom')} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${nodeType === 'custom' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                Custom Label (No Photo)
                            </button>
                        </div>

                        {nodeType === 'personnel' ? (
                            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2">
                                {members.map(member => (
                                    <button key={member.id} onClick={() => handleAddNode(member.id)} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-cyan-50 border border-transparent hover:border-cyan-200 transition-all text-left group">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                            {member.image_url ? <img src={member.image_url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-slate-300"><User size={20} /></div>}
                                        </div>
                                        <div><h4 className="font-bold text-slate-900 group-hover:text-cyan-700">{member.name}</h4><p className="text-[10px] uppercase font-bold text-slate-400">{member.position_id}</p></div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100"><Plus className="text-cyan-500" /></div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Title / Name</label>
                                    <input type="text" value={customTitle} onChange={e => setCustomTitle(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 outline-none font-bold text-slate-900" placeholder="e.g. Komite Audit" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subtitle (Optional)</label>
                                    <input type="text" value={customPosition} onChange={e => setCustomPosition(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 outline-none text-sm" placeholder="e.g. 2024-2025" />
                                </div>
                                <button
                                    onClick={() => handleAddNode()}
                                    disabled={!customTitle}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-cyan-600 transition-colors disabled:opacity-50"
                                >
                                    Add Custom Node
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Remove Node"
                message="Are you sure you want to remove this node? Any children nodes will also be removed or orphaned."
            />
        </div>
    );
};

export default StructureManager;
