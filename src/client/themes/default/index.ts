import { SharedTheme } from 'styled-components';

const sharedTheme: SharedTheme = {
  blade: {
    background: 'rgba(255, 255, 255, 0.2)',
    blur: '15px',
  },
  navbar: {
    height: '6.6rem',
  },
  zindex: {
    navbar: 400,
    sidemenu: 500,
    tooltips: 600,
    navSidemenu: 1000,
    modals: 1099,
    onboardModal: 1100,
    alerts: 1200,
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
  },
  fonts: {
    sizes: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    },
    styles: {
      get body() {
        return `
          font-size: ${sharedTheme.fonts.sizes.md};
          font-weight: 400;
        `;
      },
      get label() {
        return `
          font-size: ${sharedTheme.fonts.sizes.sm};
          font-weight: 400;
        `;
      },
      get header() {
        return `
          font-size: ${sharedTheme.fonts.sizes.xl};
          font-weight: 800;
        `;
      },
      get subheader() {
        return `
          font-size: ${sharedTheme.fonts.sizes.lg};
          font-weight: 800;
        `;
      },
      get cardHeader() {
        return `
          font-size: ${sharedTheme.fonts.sizes.lg};
          font-weight: 800;
        `;
      },
    },
  },
  devices: {
    mobile: 600,
    tablet: 960,
    tabletL: 1024,
    desktopS: 1280,
    desktop: 1920,
    desktopL: 2560,
  },
  globalFont: '"Roboto", sans-serif',
  globalMaxWidth: '120rem',
  globalRadius: '0.8rem',

  sideBar: {
    width: '16rem',
    collapsedWidth: '4.8rem',
    animation: '200ms ease-in-out',
  },

  tabbar: {
    height: '6.4rem',
  },

  alerts: {
    default: {
      background: '#191919',
      color: 'white',
    },
    info: {
      background: '#00A3FF',
      color: 'white',
    },
    success: {
      background: '#C6E11E',
      color: 'black',
    },
    error: {
      background: '#FF005E',
      color: 'white',
    },
    warning: {
      background: '#FFA800',
      color: 'white',
    },
  },

  txModal: {
    width: '38.4rem',
    gap: '.8rem',
  },

  searchList: {
    primary: '#00A3FF',
    primaryVariant: '#006AE3',
    primaryHover: '#00D1FF',
    onPrimary: '#FFFFFF',
  },

  layoutPadding: '1.6rem',
  card: {
    padding: '2.4rem',
    paddingVariant: '8rem',
  },
};

export const device = {
  mobile: `(max-width: ${sharedTheme.devices.mobile}px)`,
  tablet: `(max-width: ${sharedTheme.devices.tablet}px)`,
  tabletL: `(max-width: ${sharedTheme.devices.tabletL}px)`,
  desktopS: `(max-width: ${sharedTheme.devices.desktopS}px)`,
  desktop: `(max-width: ${sharedTheme.devices.desktop}px)`,
  desktopL: `(max-width: ${sharedTheme.devices.desktopL}px)`,
};

export { sharedTheme };
