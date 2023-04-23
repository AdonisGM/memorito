import {createStyles, Skeleton, Text} from '@mantine/core'
import {Fragment, useState} from "react";
import {Outlet} from "react-router-dom";

const useStyles = createStyles((theme) => ({
  layout: {
    width: '100%',
    height: '100vh',
    padding: '0 10px',

    overflowY: 'scroll',
    overflowX: 'hidden',

    position: 'relative',

    fontFamily: theme.fontFamily,
  },

  header: {
    borderBottom: `1px solid ${
      theme.colors.gray[3]
    }`,
    position: 'sticky',
    top: 0,
    right: 0,

    display: 'flex',
    alignItems: 'start',
    justifyContent: 'center',
    flexDirection: 'column',
    rowGap: '8px',

    height: '55px',

    backgroundColor: theme.white,
  },

  title: {
    fontWeight: 500,
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    color: theme.black,
    fontSize: theme.fontSizes.xl,
  },

  body: {
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
  }
}))

const LayoutHeaderPage = () => {
  const {classes} = useStyles();
  const [title, setTitle] = useState(null);

  return <div className={classes.layout}>
    <div className={classes.header}>
      {title === null &&
          <Fragment>
              <Skeleton height={8} width={400} radius="xl"/>
              <Skeleton height={8} width={400} radius="xl"/>
          </Fragment>
      }
      {title !== null &&
          <Text className={classes.title}>{title}</Text>
      }
    </div>
    <div className={classes.body}>
      <Outlet context={[setTitle]} />
    </div>
  </div>
}

export default LayoutHeaderPage;