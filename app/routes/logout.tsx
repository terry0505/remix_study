import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { sessionStorage } from '~/lib/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}