const Item = ({ item }) => {
	console.log('item', item);
	return (
		<div className={`task`}>
			<h3>{item.name}</h3>
			{/* <p>{item.id}</p> */}
		</div>
	);
};

export default Item;
