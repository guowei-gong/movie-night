import { Link } from "react-router-dom";
import { EmptyState } from "../components/AsyncState";

export function NotFoundPage() {
  return (
    <main className="state-page not-found-page">
      <EmptyState title="没有找到这个页面" description="内容可能已下线，或者链接地址有误。" />
      <Link className="button primary" to="/">返回首页</Link>
    </main>
  );
}
