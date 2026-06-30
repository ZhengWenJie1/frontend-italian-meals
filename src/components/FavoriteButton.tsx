import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { loadFavoriteIds, saveFavoriteIds } from "../services/storage";

type Props = { id: string; size?: number };

export default function FavoriteButton({ id, size = 22 }: Props) {
	const [fav, setFav] = useState(false);

	useEffect(() => {
		let mounted = true;
		loadFavoriteIds().then((ids) => {
			if (mounted) setFav(ids.includes(id));
		});
		return () => {
			mounted = false;
		};
	}, [id]);

	async function toggle() {
		const ids = await loadFavoriteIds();
		const exists = ids.includes(id);
		const newIds = exists ? ids.filter((x) => x !== id) : [...ids, id];
		await saveFavoriteIds(newIds);
		setFav(!exists);
	}

	return (
		<TouchableOpacity onPress={toggle} style={styles.btn} accessibilityRole="button">
			<Text style={[styles.icon, { fontSize: size }]}>{fav ? "❤️" : "🤍"}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	btn: { padding: 8 },
	icon: {},
});
