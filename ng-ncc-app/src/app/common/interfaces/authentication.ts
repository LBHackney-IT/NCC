export interface IAuthentication {
    fullname: string | null;
    userid: string | null;
    username: string | null;
    useremail: string | null;
    success: boolean;
    message: string | null;
    roles: string[] | null;
}
