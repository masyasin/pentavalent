import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';
const supabase = createClient(supabaseUrl, supabaseKey);

const missingBranches = [
    { name: 'Branch Banda Aceh', city: 'Banda Aceh', province: 'Aceh', latitude: 5.5483, longitude: 95.3238, address: 'Jl. Teuku Umar No. 12, Banda Aceh', phone: '(0651) 123456', type: 'branch', is_active: true },
    { name: 'Branch Batam', city: 'Batam', province: 'Kepulauan Riau', latitude: 1.1285, longitude: 104.0305, address: 'Kawasan Industri Batam Center, Batam', phone: '(0778) 654321', type: 'branch', is_active: true },
    { name: 'Branch Pekanbaru', city: 'Pekanbaru', province: 'Riau', latitude: 0.5071, longitude: 101.4478, address: 'Jl. Sudirman No. 45, Pekanbaru', phone: '(0761) 987654', type: 'branch', is_active: true },
    { name: 'Branch Jambi', city: 'Jambi', province: 'Jambi', latitude: -1.6101, longitude: 103.6131, address: 'Jl. Gatot Subroto No. 8, Jambi', phone: '(0741) 112233', type: 'branch', is_active: true },
    { name: 'Branch Lampung', city: 'Bandar Lampung', province: 'Lampung', latitude: -5.3971, longitude: 105.2668, address: 'Jl. Kartini No. 22, Bandar Lampung', phone: '(0721) 334455', type: 'branch', is_active: true },
    { name: 'Branch Tangerang', city: 'Tangerang', province: 'Banten', latitude: -6.1783, longitude: 106.6319, address: 'Kawasan Industri Jatake, Tangerang', phone: '(021) 556677', type: 'branch', is_active: true },
    { name: 'Branch Bogor', city: 'Bogor', province: 'Jawa Barat', latitude: -6.5971, longitude: 106.8060, address: 'Jl. Pajajaran No. 88, Bogor', phone: '(0251) 889900', type: 'branch', is_active: true },
    { name: 'Branch Cirebon', city: 'Cirebon', province: 'Jawa Barat', latitude: -6.7058, longitude: 108.5555, address: 'Jl. Tuparev No. 15, Cirebon', phone: '(0231) 223344', type: 'branch', is_active: true },
    { name: 'Branch Pontianak', city: 'Pontianak', province: 'Kalimantan Barat', latitude: -0.0263, longitude: 109.3425, address: 'Jl. Gajah Mada No. 100, Pontianak', phone: '(0561) 554433', type: 'branch', is_active: true },
    { name: 'Branch Tegal', city: 'Tegal', province: 'Jawa Tengah', latitude: -6.8674, longitude: 109.1255, address: 'Jl. Mayjend Sutoyo No. 5, Tegal', phone: '(0283) 667788', type: 'branch', is_active: true },
    { name: 'Branch Purwokerto', city: 'Purwokerto', province: 'Jawa Tengah', latitude: -7.4243, longitude: 109.2302, address: 'Jl. Jendral Sudirman No. 10, Purwokerto', phone: '(0281) 998877', type: 'branch', is_active: true },
    { name: 'Branch Solo', city: 'Surakarta', province: 'Jawa Tengah', latitude: -7.5666, longitude: 110.8243, address: 'Jl. Adi Sucipto No. 25, Solo', phone: '(0271) 445566', type: 'branch', is_active: true },
    { name: 'Branch Banjarmasin', city: 'Banjarmasin', province: 'Kalimantan Selatan', latitude: -3.3167, longitude: 114.5901, address: 'Jl. Ahmad Yani No. 12, Banjarmasin', phone: '(0511) 778899', type: 'branch', is_active: true },
    { name: 'Branch Mataram', city: 'Mataram', province: 'Nusa Tenggara Barat', latitude: -8.5799, longitude: 116.0999, address: 'Jl. Pejanggik No. 50, Mataram', phone: '(0370) 332211', type: 'branch', is_active: true },
    { name: 'Branch Kupang', city: 'Kupang', province: 'Nusa Tenggara Timur', latitude: -10.1772, longitude: 123.6070, address: 'Jl. El Tari No. 1, Kupang', phone: '(0380) 556644', type: 'branch', is_active: true },
    { name: 'Branch Kediri', city: 'Kediri', province: 'Jawa Timur', latitude: -7.8480, longitude: 112.0178, address: 'Jl. Doho No. 30, Kediri', phone: '(0354) 887766', type: 'branch', is_active: true },
    { name: 'Branch Jember', city: 'Jember', province: 'Jawa Timur', latitude: -8.1845, longitude: 113.6681, address: 'Jl. Gajah Mada No. 12, Jember', phone: '(0331) 221100', type: 'branch', is_active: true },
    { name: 'Branch Palu', city: 'Palu', province: 'Sulawesi Tengah', latitude: -0.8917, longitude: 119.8707, address: 'Jl. Moh. Hatta No. 4, Palu', phone: '(0451) 443322', type: 'branch', is_active: true },
    { name: 'Branch Kendari', city: 'Kendari', province: 'Sulawesi Tenggara', latitude: -3.9985, longitude: 122.5129, address: 'Jl. Ahmad Yani No. 8, Kendari', phone: '(0401) 990088', type: 'branch', is_active: true },
    { name: 'Branch Manado', city: 'Manado', province: 'Sulawesi Utara', latitude: 1.4748, longitude: 124.8421, address: 'Jl. Sam Ratulangi No. 15, Manado', phone: '(0431) 556677', type: 'branch', is_active: true },
    { name: 'Branch Balikpapan', city: 'Balikpapan', province: 'Kalimantan Timur', latitude: -1.2654, longitude: 116.8312, address: 'Jl. Sudirman No. 10, Balikpapan', phone: '(0542) 112233', type: 'branch', is_active: true }
];

async function seed() {
    console.log('Seeding missing branches...');
    const { data, error } = await supabase.from('branches').insert(missingBranches);
    if (error) {
        console.error('Error seeding:', error);
    } else {
        console.log('Successfully seeded missing branches!');
    }
}

seed();
