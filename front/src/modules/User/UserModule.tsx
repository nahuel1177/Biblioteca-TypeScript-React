import { User } from "../../components/User";
import { LayoutModule } from "../Layout";

export const UserModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <User />
      </div>
    </>
  );
};