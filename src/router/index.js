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
        {
            path: '/',
            component: importComponent('DashboardLayout'),
            children: [
                //Dashboard
                {
                    path: '/',
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
            ],
        },

        //register
        {
            path: '/register',
            name: 'Register',
            meta: { title: 'Register' },
            component: importComponent('Register'),
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

//Set Judul
// router.beforeEach((to, from, next) => {
//     if(to.name != "Login" && localStorage.getItem("token") == null && to.name!="Register"){
//         next('login')
//         document.to.meta.title = "Login"
        
//     }
//     document.title = to.meta.title;
//     next();
// });

export default router;
