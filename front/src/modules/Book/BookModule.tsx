import { Book } from "../../components/Book";
import { LayoutModule } from "../Layout";

export const BookModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <Book />
      </div>
    </>
  );
};