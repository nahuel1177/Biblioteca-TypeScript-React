import { CreateUserPage } from "../../components/User/CreateUserPage";
import { LayoutModule } from "../Layout";

export const CreateUserModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <CreateUserPage />
      </div>
    </>
  );
};