import { ChatBubbleLeftRightIcon, LinkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { footerGroups } from "../data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {footerGroups.map((group) => (
          <div className="footer-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </div>
        ))}
        <div className="footer-group">
          <h3>关注我们</h3>
          <div className="socials">
            <a href="#" aria-label="社群主页">
              <ChatBubbleLeftRightIcon className="svg-icon icon-18" />
            </a>
            <a href="#" aria-label="最新动态">
              <PaperAirplaneIcon className="svg-icon icon-18" />
            </a>
            <a href="#" aria-label="商务合作">
              <LinkIcon className="svg-icon icon-18" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>@2023 StreamVibe，保留所有权利</p>
        <div>
          <a href="#">使用条款</a>
          <a href="#">隐私政策</a>
          <a href="#">Cookie 政策</a>
        </div>
      </div>
    </footer>
  );
}
