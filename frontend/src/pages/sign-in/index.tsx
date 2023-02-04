import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Center,
} from '@mantine/core';
import LayoutAuth from '../../components/layout-auth';
import { Link } from 'react-router-dom';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { isEmail, useForm } from '@mantine/form';
import validator from 'validator';
import useFetch from '../../custom-hooks/fetch';

const SignIn = () => {
  const [execute, data, status] = useFetch('sign_in_password');

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: isEmail('Email not valid'),
      password: (value) => (validator.isEmpty(value) ? 'Password is require' : null),
    },
  });

  const handleSubmitForm = form.onSubmit((values) => {
    execute({
      body: values
    })
  });

  return (
    <LayoutAuth>
      <Title
        align="center"
        sx={() => ({fontWeight: 900})}
        pt={40}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor component={Link} to={'/sign-up'}>
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmitForm}>
          <TextInput
            label="Email"
            placeholder="you@example.dev"
            withAsterisk
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            withAsterisk
            placeholder="Your password"
            mt="md"

            {...form.getInputProps('password')}
          />
          <Group position="right" mt="xs">
            <Anchor size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Group position="apart" mt={'xl'}>
            <Anchor size="sm" color={'gray.5'} component={Link} to={'/'}>
              <Center inline>
                <IconArrowNarrowLeft size={16}/>
                <Text>Back to home</Text>
              </Center>
            </Anchor>
            <Button type={'submit'}>
              Sign in
            </Button>
          </Group>
        </form>
      </Paper>
    </LayoutAuth>
  );
};

export default SignIn;