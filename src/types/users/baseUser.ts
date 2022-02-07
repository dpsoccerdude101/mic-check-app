import UserTypeEnum from './loggedUserTypeEnum';

export default interface BaseUser {
    id: string;
    email: string;
    name: string;
    surname?: string; // TODO: added this quickly... should this be required or will that screw up other code?
    type?: UserTypeEnum; // TODO: REMOVE
}
