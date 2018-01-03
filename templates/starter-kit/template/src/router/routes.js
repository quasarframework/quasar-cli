
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') },
      { path: 'index2/test', component: () => import('pages/index2') },
      { path: 'action-sheet', component: () => import('pages/demo/action-sheet') },
      { path: 'alert', component: () => import('pages/demo/alert') },
      { path: 'collapsible', component: () => import('pages/demo/collapsible') },
      { path: 'dialog', component: () => import('pages/demo/dialog') },
      { path: 'fab', component: () => import('pages/demo/fab') },
      { path: 'modal', component: () => import('pages/demo/modal') },
      { path: 'popover', component: () => import('pages/demo/popover') },
      { path: 'tooltip', component: () => import('pages/demo/tooltip') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
