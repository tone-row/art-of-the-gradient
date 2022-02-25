import { AiFillStar, AiOutlineTwitter } from "react-icons/ai";

import { SiGithubsponsors } from "react-icons/si";

export function Support() {
  return (
    <section className="support">
      <a
        href="https://github.com/tone-row/art-of-the-gradient"
        className="app-btn"
      >
        <AiFillStar size={12} />
        Star on Github
      </a>
      <a href="https://twitter.com/tone_row_" className="app-btn">
        <AiOutlineTwitter size={12} />
        Follow Us
      </a>
      <a href="https://github.com/sponsors/tone-row" className="app-btn">
        <SiGithubsponsors size={12} />
        Become a Sponsor
      </a>
    </section>
  );
}
