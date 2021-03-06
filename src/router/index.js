import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
function importComponent(path) {
    return () => import(`../components/${path}.vue`)
}
Vue.use(VueRouter);


const router = new VueRouter({
    mode: 'history',
    routes: [
        //login
        {
            path: '/',
            name: 'Home',
            meta: { title: 'Atma Jaya Rental' },
            component: importComponent('Home'),
        },
        {
            
            path: '/',
            component: importComponent('DashboardLayout'),
            children: [
                //Dashboard
                {
                    path: '/dashboardpegawai',
                    name: 'DashboardPegawai',
                    meta: {title : 'DashboardPegawai'},
                    component: importComponent('DashboardPegawai'),
                },
                //Dashboard
                {
                    path: '/dashboard',
                    name: 'Dashboard',
                    meta: {title : 'Dashboard'},
                    component: importComponent('Dashboard'),
                },
                //promo
                {
                    path: '/promo',
                    name: 'Promo',
                    meta: {title : 'Promo'},
                    component: importComponent('DataMaster/Promo'),
                },
                //detail shift
                {
                    path: '/detailshift',
                    name: 'DetailShift',
                    meta: {title : 'DetailShift'},
                    component: importComponent('DataMaster/DetailShift'),
                },
                //role
                {
                    path: '/role',
                    name: 'Role',
                    meta: {title : 'Role'},
                    component: importComponent('DataMaster/Role'),
                },
                //pegawai
                {
                    path: '/pegawai',
                    name: 'Pegawai',
                    meta: {title : 'Pegawai'},
                    component: importComponent('DataMaster/Pegawai'),
                },
                //mobil
                {
                    path: '/mobil',
                    name: 'Mobil',
                    meta: {title : 'Mobil'},
                    component: importComponent('DataMaster/Mobil'),
                },
                //driver
                {
                    path: '/driver',
                    name: 'Driver',
                    meta: {title : 'Driver'},
                    component: importComponent('DataMaster/Driver'),
                },
                //customer
                {
                    path: '/customer',
                    name: 'Customer',
                    meta: {title : 'Customer'},
                    component: importComponent('DataMaster/Customer'),
                },
                //transaksi
                {
                    path: '/transaksi',
                    name: 'Transaksi',
                    meta: {title : 'Transaksi'},
                    component: importComponent('DataMaster/Transaksi'),
                },
                //mitra
                {
                    path: '/mitra',
                    name: 'Mitra',
                    meta: {title : 'Mitra'},
                    component: importComponent('DataMaster/Mitra'),
                },
                //mitra
                {
                    path: '/jadwal',
                    name: 'Jadwal',
                    meta: {title : 'Jadwal'},
                    component: importComponent('DataMaster/Jadwal'),
                },
                //mitra
                {
                    path: '/aset',
                    name: 'Aset',
                    meta: {title : 'Aset'},
                    component: importComponent('DataMaster/Aset'),
                },
                //riwayatTransaksiCustomer
                {
                    path: '/riwayattransaksi',
                    name: 'RiwayatTransaksi',
                    meta: {title : 'Riwayat Transaksi'},
                    component: importComponent('Customer/RiwayatTransaksi'),
                },
                //riwayatTransaksiCustomer
                {
                    path: '/mobilcustomer',
                    name: 'MobilCustomer',
                    meta: {title : 'List Mobil Customer'},
                    component: importComponent('Customer/MobilCustomer'),
                },
                 //riwayatTransaksiCustomer
                 {
                    path: '/drivercustomer',
                    name: 'DriverCustomer',
                    meta: {title : 'List Driver Customer'},
                    component: importComponent('Customer/DriverCustomer'),
                },
            ],
        },

        //register
        {
            path: '/profile',
            name: 'Profile',
            meta: { title: 'Profile' },
            component: importComponent('Profile'),
        },
        //login
        {
            path: '/login',
            name: 'Login',
            meta: { title: 'Login' },
            component: importComponent('Login'),
        },
        
        {
            path: '*',
            redirect: '/'
        },
    ]
});

router.beforeEach((to, from, next) => {
    if(to.name == "Dashboard" && localStorage.getItem("token") == null ||
    to.name == "Aset" && localStorage.getItem("token") == null ||
    to.name == "Customer" && localStorage.getItem("token") == null ||
    to.name == "DetailShift" && localStorage.getItem("token") == null ||
    to.name == "Driver" && localStorage.getItem("token") == null ||
    to.name == "Jadwal" && localStorage.getItem("token") == null ||
    to.name == "Mitra" && localStorage.getItem("token") == null ||
    to.name == "Mobil" && localStorage.getItem("token") == null ||
    to.name == "Pegawai" && localStorage.getItem("token") == null ||
    to.name == "Promo" && localStorage.getItem("token") == null ||
    to.name == "Role" && localStorage.getItem("token") == null ||
    to.name == "Transaksi" && localStorage.getItem("token") == null){
        next('home')
        document.to.meta.title = "Home"
    }

    if(to.name == "DetailShift" && localStorage.getItem("id_role") != "1" && localStorage.getItem("token") == null ||
    to.name == "Jadwal" && localStorage.getItem("id_role") != "1" && localStorage.getItem("token") == null ||
    to.name == "Promo" && localStorage.getItem("id_role") != "1" && localStorage.getItem("token") == null){
        next('dashboardpegawai')
        document.to.meta.title = "DashboardPegawai"
    }

    if(to.name == "Pegawai" && localStorage.getItem("id_role") != "2" && localStorage.getItem("token") == null ||
    to.name == "Mobil" && localStorage.getItem("id_role") != "2" && localStorage.getItem("token") == null ||
    to.name == "Aset" && localStorage.getItem("id_role") != "2" && localStorage.getItem("token") == null ||
    to.name == "Mitra" && localStorage.getItem("id_role") != "2" && localStorage.getItem("token") == null ||
    to.name == "Driver" && localStorage.getItem("id_role") != "2" && localStorage.getItem("token") == null ||
    to.name == "Role" && localStorage.getItem("id_role") != "2" && localStorage.getItem("token") == null){
        next('dashboardpegawai')
        document.to.meta.title = "DashboardPegawai"
    }

    if(to.name == "Transaksi" && localStorage.getItem("id_role") != "3" && localStorage.getItem("token") != null ||
    to.name == "Customer" && localStorage.getItem("id_role") != "3" && localStorage.getItem("token") != null){
        next('dashboardpegawai')
        document.to.meta.title = "DashboardPegawai"
    }

    if(to.name == "DriverCustomer" && localStorage.getItem("id_customer") == '' && localStorage.getItem("token") != null ||
    to.name == "MobilCustomer" && localStorage.getItem("id_customer") == '' && localStorage.getItem("token") != null ||
    to.name == "RiwayatTransaksi" && localStorage.getItem("id_customer") == '' && localStorage.getItem("token") != null){
        next('dashboard')
        document.to.meta.title = "Dashboard"
    }
    
    document.title = to.meta.title;
    next();
});

export default router;
