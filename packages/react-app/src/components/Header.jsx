import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex",  flexDirection: "column", flex: 1, alignItems: "start" }}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Title level={3} style={{ margin: "0 0.5rem 0 0" }}>{title}</Title>
        </a>
        <Text type="secondary" style={{ textAlign: "left" }}>{subTitle}</Text>
      </div>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "https://github.com/austintgriffith/scaffold-eth",
  title: "BuidlGuidl Juicebox Treasury Tools",
  subTitle: "",
};

/*
Header.defaultProps = {
  link: "https://github.com/austintgriffith/scaffold-eth",
  title: "🏗 scaffold-eth",
  subTitle: "forkable Ethereum dev stack focused on fast product iteration",
}; */

/*
 */

//<h1 title="🏰 BuidlGuidl" style="font-size: 2.4rem; line-height: 2.8rem; margin: 0px; color: rgb(225, 224, 232); overflow: hidden; text-overflow: ellipsis;">🏰 BuidlGuidl</h1>

//<img src="https://jbx.mypinata.cloud/ipfs/QmdpvtkAz13MCritsj6PQzjvFvFQbC5wfbwVT8PSs9fxcu" alt="🏰 BuidlGuidl logo" style="max-height: 100%; min-width: 100%; object-fit: cover; object-position: center center;"></img>
