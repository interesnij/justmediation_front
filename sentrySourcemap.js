const SentryCli = require('@sentry/cli');

async function uploadSourcemapsAndRelease() {
  const release = process.env.REACT_APP_SENTRY_RELEASE;
  if (!release) {
    console.warn('REACT_APP_SENTRY_RELEASE is not set');
    return;
  }
  const cli = new SentryCli();
  try {
    await cli.releases.new(release);
    await cli.releases.uploadSourceMaps(release, {
      include: ['build/static/js'],
      urlPrefix: '~/static/js',
      rewrite: false,
    });
    await cli.releases.finalize(release);
  } catch (e) {
    console.error('Source maps uploading failed:', e);
  }
}
uploadSourcemapsAndRelease();