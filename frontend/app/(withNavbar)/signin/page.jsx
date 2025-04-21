import LoginCard from "@/components/LoginCard";
import PageWrapper from "@/app/page-wrapper";

function SignInPage() {
  return (
    <PageWrapper fullHeight>
      <div className="flex items-center justify-center h-full">
        <LoginCard />
      </div>
    </PageWrapper>
  );
}
export default SignInPage;

