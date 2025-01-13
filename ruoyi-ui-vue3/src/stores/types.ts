export interface LayoutTypes {
  name: string; //组件注册名称
  id: string; //组件添加时候的唯一id(删除等需要使用)
}
export interface UserType {
  token: string | undefined;
  name: string;
  nickName: string;
  phonenumber: string;
  email: string;
  avatar: string;
  roles: string[];
  permissions: string[];
  layout: LayoutTypes[];
}
