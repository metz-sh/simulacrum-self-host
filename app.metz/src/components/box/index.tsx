import anime from 'animejs';
import { useEffect, useRef, useState } from 'react';
import styles from './box.module.css';

function getCenter(offset: { left: number; top: number }, size: number, border: number) {
	return {
		x: offset.left + size / 2,
		y: offset.top + size / 2,
	};
}

function getDistance(
	referencePosition: { x: number; y: number },
	targetPosition: { x: number; y: number }
) {
	return {
		offset: {
			x: targetPosition.x - referencePosition.x,
			y: targetPosition.y - referencePosition.y,
		},
	};
}

function getScaledTranslate(offset: { x: number; y: number }) {
	const scaleFactor = 0.009;
	const xOffset = offset.x * scaleFactor;
	const yOffset = offset.y * scaleFactor;
	return {
		x: xOffset > 0 ? Math.min(xOffset, 5) : Math.max(xOffset, -5),
		y: yOffset > 0 ? Math.min(yOffset, 5) : Math.max(yOffset, -5),
	};
}

export default function (props: { id: string; children?: any; size: number; animate?: boolean }) {
	const ref = useRef();
	const [coords, setCoords] = useState({ x: 0, y: 0 });
	useEffect(() => {
		const center = getCenter(
			{
				left: document.getElementById(props.id)!.getClientRects()[0].left,
				top: document.getElementById(props.id)!.getClientRects()[0].top,
			},
			props.size,
			2
		);
		if (props.animate) {
			const translate = getScaledTranslate(getDistance(center, coords).offset);
			// console.log();
			anime
				.timeline({
					targets: document.getElementById(props.id),
					easing: 'linear',
				})
				.add({
					translateX: translate.x,
					translateY: translate.y,
					duration: 0,
				});
		}
	}, [coords]);

	useEffect(() => {
		const handleWindowMouseMove = (event: any) => {
			setCoords({
				x: event.clientX,
				y: event.clientY,
			});
		};
		window.addEventListener('mousemove', handleWindowMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleWindowMouseMove);
		};
	}, []);

	return (
		<>
			<div
				ref={ref as any}
				id={props.id}
				style={{ height: `${props.size}px`, width: `${props.size}px` }}
				className={styles.box_container}
			>
				{props.children}
			</div>
		</>
	);
}
