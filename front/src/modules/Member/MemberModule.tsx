import { Member } from "../../components/Member";
import { LayoutModule } from "../Layout";

export const MemberModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <Member />
      </div>
    </>
  );
};