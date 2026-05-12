/**
 * data/default-data.js
 * Data bawaan (default) untuk SIG Kampus III UNKHAIR.
 * Edit file ini untuk mengubah data awal bangunan, jalan, dan zona.
 */

const DEFAULT_DATA = {
    bangunan: [
        { "id": "b1", "nama": "Kampus III UNKHAIR (Pusat)", "fungsi": "Pusat Kampus", "jenis": "perkuliahan", "kapasitas": 1000, "inventaris": "Gedung utama, ruang kuliah", "pengelola": "Rektorat", "latitude": 0.77602035747594, "longitude": 127.37435889881644 },
        { "id": "b1778490954125", "nama": "404 Kofi", "fungsi": "UMKM Mahasiswa Informatika", "jenis": "fasilitas", "kapasitas": 50, "inventaris": "", "pengelola": "Alumni Informatika ( Ka As) ", "latitude": 0.7760897, "longitude": 127.37445017 },
        { "id": "b1778490993002", "nama": "Lab MUGIS", "fungsi": "Perkuliahan", "jenis": "laboratorium", "kapasitas": 50, "inventaris": "", "pengelola": "Kepala Lab MUGIS", "latitude": 0.77591406, "longitude": 127.37403318 },
        { "id": "b1778491071716", "nama": "Lab Jak", "fungsi": "Perkuliahan", "jenis": "laboratorium", "kapasitas": 50, "inventaris": "", "pengelola": "Kepala Lab JAK", "latitude": 0.77583878, "longitude": 127.37416524 },
        { "id": "b1778491111307", "nama": "Lab RPL", "fungsi": "Perkuliahan", "jenis": "laboratorium", "kapasitas": 50, "inventaris": "", "pengelola": "Kepala Lab RPL", "latitude": 0.77576309, "longitude": 127.37432081 },
        { "id": "b1778491183920", "nama": "Ruang Kepala Lab RPL", "fungsi": "Administrasi", "jenis": "administrasi", "kapasitas": 5, "inventaris": "", "pengelola": "Kepala Lab RPL", "latitude": 0.77576303, "longitude": 127.37424285 },
        { "id": "b1778491224911", "nama": "Ruang Kepala Lab JAK", "fungsi": "Administrasi", "jenis": "administrasi", "kapasitas": 5, "inventaris": "", "pengelola": "Kepala Lab Jak", "latitude": 0.77579873, "longitude": 127.37417266 },
        { "id": "b1778491326316", "nama": "Sekretariatan HMTI", "fungsi": "Kegiatan Mahasiswa", "jenis": "administrasi", "kapasitas": 1000, "inventaris": "", "pengelola": "Kepala Bidang Kesekretariatan", "latitude": 0.77584434, "longitude": 127.37446904 },
        { "id": "b1778491381195", "nama": "Ruangan Administrasi HMTI", "fungsi": "Administrasi Penyuratan", "jenis": "administrasi", "kapasitas": 5, "inventaris": "", "pengelola": "Sekretaris Umum HMTI", "latitude": 0.7757814, "longitude": 127.37447038 },
        { "id": "b1778491502030", "nama": "Tata Usaha, Ruang Prodi Lama", "fungsi": "", "jenis": "administrasi", "kapasitas": 5, "inventaris": "", "pengelola": "Kepala Tata Usaha, Kaprodi", "latitude": 0.77590094, "longitude": 127.3744867 },
        { "id": "b1778491553971", "nama": "Server, Riset", "fungsi": "Pengelolaan data", "jenis": "administrasi", "kapasitas": 5, "inventaris": "", "pengelola": "Kepala Server, Kaprodi", "latitude": 0.77586978, "longitude": 127.37453733 },
        { "id": "b1778491697579", "nama": "Ruang Sidang", "fungsi": "Perkuliahan Sidang", "jenis": "perkuliahan", "kapasitas": 55, "inventaris": "", "pengelola": "Dosen Informatika", "latitude": 0.7759785, "longitude": 127.37458706 },
        { "id": "b1778491853977", "nama": "JT-01", "fungsi": "Perkuliahan", "jenis": "perkuliahan", "kapasitas": 50, "inventaris": "", "pengelola": "Dekan & Dosen Informatika", "latitude": 0.77624225, "longitude": 127.37433627 },
        { "id": "b1778491898182", "nama": "JT-02", "fungsi": "Perkuliahan", "jenis": "perkuliahan", "kapasitas": 50, "inventaris": "", "pengelola": "Dekan & Dosen Informatika", "latitude": 0.77618334, "longitude": 127.37428129 },
        { "id": "b1778491978239", "nama": "JT-03", "fungsi": "Perkuliahan", "jenis": "perkuliahan", "kapasitas": 50, "inventaris": "", "pengelola": "Dekan & Dosen Informatika", "latitude": 0.7761031, "longitude": 127.37422541 },
        { "id": "b1778491998547", "nama": "JT-04", "fungsi": "Perkuliahan", "jenis": "perkuliahan", "kapasitas": 50, "inventaris": "", "pengelola": "Dekan & Dosen Informatika", "latitude": 0.77603416, "longitude": 127.37416707 },
        { "id": "b1778492025454", "nama": "JT-05", "fungsi": "Perkuliahan", "jenis": "perkuliahan", "kapasitas": 50, "inventaris": "", "pengelola": "Dekan & Dosen Informatika", "latitude": 0.77596374, "longitude": 127.37410963 },
        { "id": "b2", "nama": "Lab RPL", "fungsi": "Laboratorium", "jenis": "laboratorium", "kapasitas": 90, "inventaris": "PC, server", "pengelola": "Kepala Lab RISET", "latitude": 0.77581481, "longitude": 127.37422362 },
        { "id": "b3", "nama": "JT-06", "fungsi": "Perkuliahan", "jenis": "perkuliahan", "kapasitas": 200, "inventaris": "Ruang kelas", "pengelola": "Fakultas Teknik", "latitude": 0.7758938766063236, "longitude": 127.37411189661997 },
        { "id": "b4", "nama": "Program Studi Informatika, Ruang Kaprodi", "fungsi": "Administrasi", "jenis": "administrasi", "kapasitas": 100, "inventaris": "", "pengelola": "Dekan & Kaprodi", "latitude": 0.7760048873056522, "longitude": 127.37453274739794 },
        { "id": "b5", "nama": "Kantin Kampus III", "fungsi": "Kantin", "jenis": "fasilitas", "kapasitas": 80, "inventaris": "Meja kursi", "pengelola": "Pengelola", "latitude": 0.7758394608043214, "longitude": 127.3744049784152 }
    ],
    jalan: [
        {
            "id": "j1778492622411",
            "nama": "Jalan Kampus III Universitas Khairun",
            "koordinat": [
                [0.7764518562507153, 127.37459778785707],
                [0.7759452668243263, 127.37423032522203],
                [0.775886298739, 127.37433090806009],
                [0.7759881527040315, 127.37444624304774]
            ]
        }
    ],
    zona: [
        { "id": "z1778492870612", "nama": "Perpohonan", "jenis": "hijau", "parentId": null, "koordinat": [[0.7761883970956162,127.37444875942592],[0.7762152248004959,127.37442060574618],[0.7759201200373415,127.3741752665367],[0.7758973164866022,127.37420073891363],[0.7761883970956162,127.37444875942592]] },
        { "id": "z1778492934251", "nama": "Perpohonan", "jenis": "hijau", "parentId": null, "koordinat": [[0.7759133799989966,127.37424219716242],[0.7758771625947742,127.37422476869399],[0.7758007036292885,127.37435078992725],[0.7758261899512867,127.37435883383574],[0.7759133799989966,127.37424219716242]] },
        { "id": "z1778493055848", "nama": "Tanaman", "jenis": "hijau", "parentId": null, "koordinat": [[0.7760515152279107,127.3745425465766],[0.7760568807690673,127.37451037094256],[0.7760099322836513,127.37448757986847],[0.7759924942746285,127.37450903029118],[0.7760515152279107,127.3745425465766]] },
        { "id": "z1778493148225", "nama": "Parkiran Dosen & Mahasiswa", "jenis": "parkir", "parentId": null, "koordinat": [[0.7760858953933469,127.37436669469604],[0.7759651707162996,127.37447662811232],[0.7758444460358173,127.3743640133932],[0.7759437085511262,127.37425139867409],[0.7760743183740199,127.3743709359457],[0.7760858953933469,127.37436669469604]] },
        { "id": "z1778493419000", "nama": "Parkiran Mahasiswa", "jenis": "parkir", "parentId": null, "koordinat": [[0.776449843244198,127.37457878630221],[0.776418991385267,127.37460157737634],[0.7758864614370306,127.37420206325383],[0.7759106063731576,127.37417525022546],[0.776449843244198,127.37457878630221]] },
        { "id": "z1778493505955", "nama": "Administrasi Program Studi", "jenis": "administrasi", "parentId": null, "koordinat": [[0.7760528877058412,127.37454390671088],[0.7760072806056859,127.3746283677502],[0.7758476557512489,127.37454390671088],[0.7758878973117489,127.3744621269744],[0.7760528877058412,127.37454390671088]] },
        { "id": "z1778493584351", "nama": "Administrasi HMTI", "jenis": "administrasi", "parentId": null, "koordinat": [[0.7758798001397669,127.37445376499696],[0.775844924120627,127.37453152277917],[0.7757657823837933,127.3744899625852],[0.7758046825597071,127.37441890806006],[0.7758798001397669,127.37445376499696]] },
        { "id": "z1778493715595", "nama": "Administrasi Lab Jak & Administrasi Lab RPL", "jenis": "administrasi", "parentId": null, "koordinat": [[0.7758182276486649,127.37414564398114],[0.7757659136190518,127.37426898391156],[0.7757283548281695,127.37425825870025],[0.7757833516289779,127.37413491876977],[0.7758182276486649,127.37414564398114]] },
        { "id": "z1778493837875", "nama": "Area Perkuliahan", "jenis": "perkuliahan", "parentId": null, "koordinat": [[0.7763050863042088,127.3743238930773],[0.776238017043091,127.3744056728138],[0.7759120604189191,127.37412949862171],[0.7759737641439438,127.3740517408395],[0.7763050863042088,127.3743238930773]] },
        { "id": "z1778493882688", "nama": "Area Perkuliahan", "jenis": "perkuliahan", "parentId": null, "koordinat": [[0.7759602961814269,127.37401288279048],[0.7758610336665124,127.373972663248],[0.7756826294108456,127.3743453643421],[0.775775185003058,127.37438960583889],[0.7759602961814269,127.37401288279048]] },
        { "id": "z1778493960271", "nama": "Gedung Program Studi Informatika", "jenis": "perkuliahan", "parentId": null, "koordinat": [[0.7760569025743014,127.37454374405169],[0.7760112954741841,127.374628205091],[0.7758463050784761,127.37454240340024],[0.7758865466389888,127.3744606236638],[0.7760569025743014,127.37454374405169]] },
        { "id": "z1778494534893", "nama": "Area Kampus III Universitas Khairun Kota Ternate", "jenis": "batas", "parentId": null, "koordinat": [[0.7762016490239562,127.37444056962256],[0.7761895765567387,127.37444995418248],[0.776130555605403,127.3744298444112],[0.7760608035709398,127.37454379978172],[0.7760098309296533,127.37463094212389],[0.775761674640872,127.374490173725],[0.7758005748168366,127.37441643789703],[0.7756811915170603,127.37434404272045],[0.7758636199288266,127.37396731967206],[0.7759642238290144,127.37401156116883],[0.776311670878644,127.37432259365704],[0.7762392360767003,127.37441241730205],[0.7764525163233145,127.37457999872926],[0.7764189816940533,127.37460278980338],[0.7762016490239562,127.37444056962256]] }
    ]
};