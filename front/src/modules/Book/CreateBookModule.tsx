import { CreateBookPage } from "../../components/Book/CreateBookPage";
import { LayoutModule } from "../Layout";

export const CreateBookModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <CreateBookPage />
      </div>
    </>
  );
};