import Container from '@mui/material/Container';

function Page(props) {
  return (
    <Container maxWidth="lg" sx={{ my: 5 }}>
      {props.children}
    </Container>
  );
}

export default Page;