import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Center,
} from '@mantine/core';
import classes from './style.module.css';
import LayoutAuth from '../../components/layout-auth';
import { Link } from 'react-router-dom';
import { IconArrowNarrowLeft } from '@tabler/icons-react';

const SignIn = () => {
  return (
    <LayoutAuth>
      <Title
        align="center"
        sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
        pt={40}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Link to={'/sign-up'} className={classes.link}>
          <Anchor>
            Create account
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="you@example.dev" required/>
        <PasswordInput label="Password" placeholder="Your password" required mt="md"/>
        <Group position="right" mt="xs">
          <Anchor size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Group position="apart" mt={'xl'}>
          <Link to={'/'} className={classes.link}>
            <Anchor size="sm" color={'gray.5'}>
              <Center inline>
                <IconArrowNarrowLeft size={16}/>
                <Text>Back to home</Text>
              </Center>
            </Anchor>
          </Link>
          <Button>
            Sign in
          </Button>
        </Group>
      </Paper>
    </LayoutAuth>
  );
};

export default SignIn;