interface LinkTrioProps {
  linkNames: string[];
  linkDestinations: string[];
  headerName?: string;
  flexDirection: string;
}

const LinkTrio = ({
  linkNames,
  linkDestinations,
  headerName,
  flexDirection,
}: LinkTrioProps) => {
  const [link1, link2, link3] = linkDestinations;
  const [linkName1, linkName2, linkName3] = linkNames;
  return (
    <div className="link-trio">
      {headerName && <h3 className="link-trio-header">{headerName}</h3>}
      <div className={`link-trio-links flex-${flexDirection}`}>
        <a href={link1}>{linkName1}</a>
        <a href={link2}>{linkName2}</a>
        <a href={link3}>{linkName3}</a>
      </div>
    </div>
  );
};

export default LinkTrio;
