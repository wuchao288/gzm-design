import { Store, defineStore } from "pinia"
type TUserStoreState = {
    /** 登录状态 */
    online: boolean
    /** 储存用户信息 */
    user: {
      name: string | null,
      compcode:string | null
    }
    /**是否为管理员模式 */
    manager: boolean
    /** 管理员是否正在编辑模板 */
    tempEditing: boolean
  
    /*是否登录显示*/
    loginVisible:boolean
  }
  type TUserAction = {
    /** 修改登录状态 */
    changeOnline: (state: boolean) => void
    /** 修改登录用户 */
    changeUser: (userName: string,compCode:string,managerEdit:boolean) => void
    managerEdit: (status: boolean) => void
    
    changeloginVisible: (status: boolean) => void
  }

  const useUserStore = defineStore<'userStore', TUserStoreState, {}, TUserAction>('userStore', {
    state: () => ({
      loginVisible:false,
      online: true, // 登录状态，
      user: {
        name: localStorage.getItem('username'),
        compcode:localStorage.getItem('compcode')
      }, // 储存用户信息
      manager: false, // 是否为管理员模式
      tempEditing: false, // 管理员是否正在编辑模板
    }),
    actions: {
      changeOnline(status: boolean) {
        this.online = status
      },
      changeUser(name: string,compcode:string,managerEdit:boolean) {
        this.user.name = name
        this.user.compcode = compcode
        this.manager=managerEdit
        // state.user = Object.assign({}, state.user)
        // state.user = { ...state.user }
        localStorage.setItem('username', name)
        localStorage.setItem('compcode', compcode)
      },
      managerEdit(status: boolean) {
        
        if(this.manager==true){//为编辑模板时不能取消
          this.tempEditing=true;
        }else{
          this.tempEditing = status
        }
  
        if(status==false){
          //admin弹窗编辑时
          if((window.parent as any).closeEditorWin){
              (window.parent as any).closeEditorWin();
          }
          
        }
        
      },
      changeloginVisible(status: boolean){
        this.loginVisible=status;
     }
    }
  })
  
  export type TUserStore = Store<'userStore', TUserStoreState, {}, TUserAction>
  
  export default useUserStore