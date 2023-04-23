import {Code, createStyles, Group, Image, Navbar, ScrollArea, Skeleton} from '@mantine/core';
import {LinksGroup} from './nav-link-group';
import Logo from '../../asset/image/logo-no-background.svg';
import useFetch, {StatusEnum} from "../../custom-hooks/fetch";
import {useEffect} from "react";
import UserButton from "./user-button";
import {IconSettings, IconGauge} from "@tabler/icons-react";
import LayoutHeaderPage from "../../components/layout-header-page";
import {Link} from "react-router-dom";

const mockData = [
  {label: 'Dashboard', icon: IconGauge},
  {
    label: 'System',
    icon: IconSettings,
    links: [
      {label: 'Permission', link: '/app/system/permission'},
      {label: 'Role', link: '/app/system/role'},
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  footerSkeleton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: theme.spacing.md,
    margin: '14px 20px',
  },

  layout: {
    display: 'flex',
    columnGap: '10px',
  }
}));

const LayoutApp = () => {
  const {classes} = useStyles();
  const links = mockData.map((item) => <LinksGroup {...item} key={item.label}/>);
  const [execute, user, status] = useFetch('user_info');

  useEffect(() => {
    execute({});
  }, [])

  return (
    <div className={classes.layout}>
      <Navbar height={'100vh'} width={{sm: 300}} pt="md" pl="md" pr="md" className={classes.navbar}>
        <Navbar.Section className={classes.header}>
          <Group position="apart">
            <Image src={Logo} width={130} fit={'contain'}/>
            <Code sx={{fontWeight: 700}}>v0.1.0-beta</Code>
          </Group>
        </Navbar.Section>

        <Navbar.Section grow className={classes.links} component={ScrollArea}>
          <div className={classes.linksInner}>{links}</div>
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
          {status !== StatusEnum.SUCCESS &&
              <div className={classes.footerSkeleton}>
                  <div>
                      <Skeleton height={50} circle/>
                  </div>
                  <div style={{width: '100%'}}>
                      <Skeleton height={8} radius="xl"/>
                      <Skeleton height={8} mt={6} radius="xl"/>
                      <Skeleton height={8} mt={6} radius="xl"/>
                  </div>
              </div>
          }
          {status === StatusEnum.SUCCESS &&
              <UserButton
                  image={user.avatar}
                  name={user.name}
                  email={user.email}
              />
          }
        </Navbar.Section>
      </Navbar>
      <LayoutHeaderPage/>
    </div>
  );
}

export default LayoutApp