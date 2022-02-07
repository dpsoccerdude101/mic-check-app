import BandSocialMedia from 'src/types/band/bandSocialMedia';
import { Button, Divider, Grid, Link, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Colors, Icons } from 'src/constants';

const useStyles = makeStyles({
  centeredChild: {
    display: 'flex',
    alignItems: 'center'
  },
  socialMedia: {
    cursor: 'pointer',
    height: 40
  },
  smallSize: {
    fontSize: '.7rem',
    fontWeight: 600
  },
  title: {
    color: Colors.COLOR_5
  },
});

type AboutTabProps = {
  socialMedias: BandSocialMedia[],
  hometown: string,
  description: string
};

const getIconPath = (media: string): string => {
  const path = Icons[media];
  return path;
};

const AboutTab = ({ description, hometown, socialMedias }: AboutTabProps) => {
  const classes = useStyles();

  const titleDesc = (title: string, text: string) => (
    <>
      <Grid item xs={12} lg={1}><Typography className={clsx(classes.smallSize, classes.title)} variant='h2' color='secondary'>{title}</Typography></Grid>
      <Grid className={classes.centeredChild} item xs={12} lg={11}>
        <Typography className={classes.smallSize} variant='h3'>{text}</Typography>
      </Grid>
    </>
  );

  const renderSocialMedia = (url: string, name: string) => (
    <Grid key={name} item xs={2} md={1} lg={1}>
      <Link target='_blank' rel='noopener' href={url}>
        <img className={classes.socialMedia} src={getIconPath(name)} alt={name} title={name} />
      </Link>
    </Grid>
  );

  const renderSocialMedias = () => {
    const filledSocialMedias = socialMedias.filter((el) => el.url);
    const externalSocialMedias = filledSocialMedias.filter((el) => el.socialMedia.name !== 'Website');
    const mediasComponents = externalSocialMedias.map((el) => renderSocialMedia(el.url, el.socialMedia.name));
    const website = filledSocialMedias.find((el) => el.socialMedia.name === 'Website');
    if (!website) {
      return mediasComponents;
    }

    const websiteComponent = <Link id='website_anchor' target='_blank' rel='noopener' href={website.url}><Button variant='contained' fullWidth>Website</Button></Link>;

    return (
      <>
        {mediasComponents}
        <Grid style={{ padding: 0 }} item xs={12} sx={{ display: { xs: 'block', lg: 'none' } }} />
        <Grid item xs={4} lg={2}>
          {websiteComponent}
        </Grid>
      </>
    );
  };

  const renderHometown = () => titleDesc('Hometown', hometown);

  const renderDescription = () => (titleDesc('Bio', description));

  return (
    <>
      <Grid item sx={{ display: { xs: 'none', lg: 'block' } }} lg={12}>
        <Typography variant='h2'>About</Typography>
      </Grid>
      <Grid item sx={{ display: { xs: 'none', lg: 'block' } }} lg={12}>
        <Divider />
      </Grid>
      {renderSocialMedias()}
      <Grid style={{ padding: 0 }} item sx={{ display: { xs: 'none', lg: 'block' } }} lg={12} />
      {renderHometown()}
      {renderDescription()}
    </>
  );
};

export default AboutTab;
