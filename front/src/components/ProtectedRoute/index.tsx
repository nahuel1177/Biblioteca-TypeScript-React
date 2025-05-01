import { Error401 } from '../Errors/Error401';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleType: string | undefined;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roleType,
  allowedRoles,
}) => {
  const isAuthorized = roleType && allowedRoles.includes(roleType);

  if (!isAuthorized) {
    return <Error401 />;
  }

  return <>{children}</>;
};