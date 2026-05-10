import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { LinksArray } from "../../index";

export function MobileNavbar() {
    return (
        <Container>
            {LinksArray.map(({ icon, label, to }) => (
                <NavLink
                    key={label}
                    to={to}
                    className={({ isActive }) => `navitem${isActive ? ' active' : ''}`}
                >
                    <Icon icon={icon} className="navicon" />
                    <span>{label}</span>
                </NavLink>
            ))}
        </Container>
    );
}

const Container = styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.bg};
    border-top: 2px solid ${({ theme }) => theme.color2};
    display: flex;
    justify-content: space-around;
    padding: 8px 0;
    z-index: 100;

    .navitem {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        text-decoration: none;
        color: ${({ theme }) => theme.text};
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 10px;
        transition: all 0.2s;

        .navicon {
            font-size: 22px;
        }

        &.active {
            color: ${({ theme }) => theme.color1};
            background: ${({ theme }) => theme.bg6};
        }
    }
`;
