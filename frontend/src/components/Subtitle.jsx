function Subtitle(props) {
  return (
    <div>
      <h2 className={`${props.fontSize} ${props.fontWeight} ${props.color} `}>
    {props.children}
      </h2>
    </div>
  )
}

export default Subtitle