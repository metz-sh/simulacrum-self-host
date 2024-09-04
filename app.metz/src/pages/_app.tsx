import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';

import ErrorBoundary from '../components/error-boundary/error-boundary';

import '../styles/font.css';
import '@metz/simulacrum/style.css';
import { ModalsProvider } from '@mantine/modals';

import { useRouter } from 'next/router';
import { useEffect } from 'react';


export const themeOverride: MantineThemeOverride = {
	colorScheme: 'dark',
	fontFamily: 'strawfordregular',
	globalStyles: (theme) => ({
		body: {
			backgroundColor: 'rgb(6,6,12)',
			overflow: 'hidden',
		},
		pre: {
			backgroundColor: 'inherit !important',
			color: '#C1C2C5 !important',
		},
	}),
	headings: {
		fontWeight: 800,
		fontFamily: 'Space Grotesk',
	},
};

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<link rel="shortcut icon" type="image/png" href="/logo.png"></link>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<title>metz.sh</title>
				<meta
					name="description"
					content="The modern way to build architecture"
					key={'description'}
				/>
				<meta property="og:title" content="metz.sh" key={'og_title'} />
				<meta
					property="og:description"
					content="The modern way to build architecture"
					key={'og_description'}
				/>
				<meta
					property="og:image"
					content="https://cdn.statically.io/img/raw.githubusercontent.com/iostreamer-X/public/main/image.png"
				/>
			</Head>
			<MantineProvider withGlobalStyles withNormalizeCSS theme={themeOverride}>
				<ErrorBoundary>
					<Component {...pageProps} />
				</ErrorBoundary>
			</MantineProvider>
		</>
	);
}
