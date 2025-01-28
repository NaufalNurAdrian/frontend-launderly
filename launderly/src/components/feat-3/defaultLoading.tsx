import { TypeAnimation } from "react-type-animation"

export default function DefaultLoading() {
    return(
        <div>
        <TypeAnimation
        sequence={[
          'Loading...',
        ]}
        wrapper="span"
        speed={50}
        style={{ display: 'inline-block', color: '#3B82F6'}}
        repeat={3}
      /></div>
    )
}