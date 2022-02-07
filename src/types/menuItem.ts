type MenuItem = {
  path: string;
  icon?: string;
  title: string;
  children?: MenuItem[];
  display: boolean;
  permissions?: string[];
};

export default MenuItem;
