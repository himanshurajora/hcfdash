export default function Container(props){
    return (
        <div className="container notification my-3">
            {props.children}
        </div>
    )
}