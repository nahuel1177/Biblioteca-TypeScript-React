import { CreateMemberPage } from "../../components/Member/CreateMemberPage";
import { LayoutModule } from "../Layout";

export const CreateMemberModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <CreateMemberPage />
      </div>
    </>
  );
};