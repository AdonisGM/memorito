import { Burger, Button, Container, createStyles, Group, Header } from '@mantine/core';
import MemoritoLogo from '../../asset/image/logo-no-background.svg';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,

    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  links: {
    width: 260,

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  social: {
    width: 260,

    [theme.fn.smallerThan('sm')]: {
      width: 'auto',
      marginLeft: 'auto',
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colors.green[0],
      color: theme.colors.green[6]
    },
  },
}));

interface ILink {
  link: string;
  label: string;
}

const links: ILink[] = [
  {
    link: '#home',
    label: 'Home'
  },
  {
    link: '#feature',
    label: 'Feature'
  },
  {
    link: '#plan',
    label: 'Plan'
  },
  {
    link: '#contact',
    label: 'Contact'
  },
  {
    link: '#faqs',
    label: 'FAQs'
  },
];

const MeHeader = () => {
  const [opened, {toggle}] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const {classes, cx} = useStyles();

  const navigate = useNavigate()

  const handlerSignInClick = () => {
    navigate('/sign-in')
  }

  const handlerSignUpClick = () => {
    navigate('/sign-up')
  }

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {[classes.linkActive]: active === link.link})}
      onClick={(event) => {
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return <Header height={62}>
    <Container className={classes.inner} size={'xl'}>
      <Burger opened={opened} onClick={toggle} size="sm" className={classes.burger}/>
      <Group className={classes.links} spacing={5} w={400}>
        {items}
      </Group>

      <img src={MemoritoLogo} height={22} alt=""/>

      <Group spacing={5} className={classes.social} position="right" noWrap w={400}>
        <Button variant="filled" color="green" radius="md" size="xs" onClick={handlerSignUpClick}>
          Sign up
        </Button>
        <Button variant="subtle" color="green" radius="md" size="xs" onClick={handlerSignInClick}>
          Sign in
        </Button>
      </Group>
    </Container>
  </Header>;
};

export default MeHeader