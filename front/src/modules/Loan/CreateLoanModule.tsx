import { CreateLoanPage } from "../../components/Loan/CreateLoanPage";
import { LayoutModule } from "../Layout";

export const CreateLoanModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <CreateLoanPage />
      </div>
    </>
  );
};