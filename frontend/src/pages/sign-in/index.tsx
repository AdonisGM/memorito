import { Alert, Anchor, Button, Center, Group, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import LayoutAuth from '../../components/layout-auth';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { isEmail, useForm } from '@mantine/form';
import validator from 'validator';
import useFetch, { StatusEnum } from '../../custom-hooks/fetch';
import { useEffect, useState } from 'react';
import useErrorApis from '../../custom-hooks/errorApis';
import { useLocalStorage } from '../../custom-hooks/local-manage';

const SignIn = () => {
  const [execute, data, status] = useFetch('sign_in_password');
  const [error, setError] = useState<string | undefined>(undefined);

  const errorApis = useErrorApis()
  const local = useLocalStorage()
  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Email not valid'),
      password: (value) => (validator.isEmpty(value) ? 'Password is require' : null),
    },
  });

  const handleSubmitForm = form.onSubmit((values) => {
    execute({
      body: values,
    });
  });

  useEffect(() => {
    switch (status) {
      case StatusEnum.IDLE:
      case StatusEnum.FETCHING:
        setError(undefined)
        break;
      case StatusEnum.SUCCESS:
        local.accessToken.write(data?.accessToken)
        local.refreshToken.write(data?.refreshToken)
        local.role.write(data?.role.value)
        local.permission.write(data?.role.permissions.map((item: any) => item.value))
        local.admin.write(data?.isAdmin)
        navigate('/app')
        break;
      case StatusEnum.FAIL:
        setError(errorApis.get(data.message.code))
        break;
      default:
        setError('Login fail');
        break;
    }
  }, [status]);

  return (
    <LayoutAuth>
      <Title
        align="center"
        sx={() => ({ fontWeight: 900 })}
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
        {error &&
            <Alert color="orange.5" mb={'lg'} variant={'filled'}>
              {error}
            </Alert>
        }
        <form onSubmit={handleSubmitForm}>
          <TextInput
            label="Email"
            placeholder="you@example.dev"
            description={'If you learning in FPT University, let use that.'}
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
            <Button type={'submit'} loading={status == StatusEnum.FETCHING}>
              Sign in
            </Button>
          </Group>
        </form>
      </Paper>
    </LayoutAuth>
  );
};

export default SignIn;