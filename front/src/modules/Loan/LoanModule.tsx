import { Loan } from "../../components/Loan";
import { LayoutModule } from "../Layout";

export const LoanModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  return (
    <>
      <LayoutModule roleType={roleType} />
      <div style={{ marginTop: "20px" }}>
        <Loan />
      </div>
    </>
  );
};