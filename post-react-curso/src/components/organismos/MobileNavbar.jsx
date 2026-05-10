import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { LinksArray, SecondarylinksArray } from "../../index";

export function MobileNavbar() {
    const allLinks = [...LinksArray, ...SecondarylinksArray];

    return (
        <Container>
            {allLinks.map(({ icon, label, to }) => (
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
    align-items: center;
    padding: 6px 0 10px;
    z-index: 100;

    .navitem {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        text-decoration: none;
        color: ${({ theme }) => theme.colorSubtitle};
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 6px 12px;
        border-radius: 12px;
        transition: all 0.2s;
        letter-spacing: 0.3px;

        .navicon {
            font-size: 23px;
        }

        &.active {
            color: ${({ theme }) => theme.color1};
            .navicon {
                filter: drop-shadow(0 0 6px ${({ theme }) => theme.color1}88);
            }
        }
    }
`;