interface LinkTrioProps {
  linkNames: string[];
  linkDestinations: string[];
  headerName?: string;
}

const LinkTrio = ({
  linkNames,
  linkDestinations,
  headerName,
}: LinkTrioProps) => {
  const [link1, link2, link3] = linkDestinations;
  const [linkName1, linkName2, linkName3] = linkNames;
  return (
    <div className="link-trio">
      {headerName && <h3 className="link-trio-header">{headerName}</h3>}
      <div className="link-trio-links flex-col">
        <a target="_blank" href={link1}>
          {linkName1}
        </a>
        <a target="_blank" href={link2}>
          {linkName2}
        </a>
        <a target="_blank" href={link3}>
          {linkName3}
        </a>
      </div>
    </div>
  );
};

export default LinkTrio;
