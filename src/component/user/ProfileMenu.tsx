import { FC, memo } from "react"
import { Link } from "react-router-dom"
import { LoggedOwner } from "../../interface/user/IUserData"

export const ProfileMenu: FC<{ profile: LoggedOwner, logoutHanlde: () => void, screen: 'sm' | 'large' }> = memo(({ logoutHanlde, profile, screen }) => {
    return (
        <>
            <div className="dropdown dropdown-hover  dropdown-bottom dropdown-end ">
                <div tabIndex={0} className="cursor-pointer">
                    <div className='avatar '>
                        <div className='w-16 rounded-full '>
                            <img
                                src={profile?.profile_picture ?? 'https://t4.ftcdn.net/jpg/03/40/12/49/240_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'}
                                alt="user avatar"
                            />
                        </div>
                        {screen === 'sm' && <h3 className="text-black mt-2   capitalize font-bold px-4 py-2">{profile?.name ?? 'Arjun'}</h3>
                        }
                    </div>
                </div>

                <div tabIndex={0} className={`${(screen === 'sm') ? 'bg-base-300 ' : ' bg-base-100'} dropdown-content menu   rounded-box z-[1] w-52 p-2 shadow`}>
                    <h3 className="text-black capitalize px-4 py-2">{profile?.name ?? 'Arjun'}</h3>
                    <hr className="my-1" />
                    <ul className="list-none">
                        <Link to={'/profile'}>
                            <li className="dropdownItem ">
                                <span className="text-black cursor-pointer">Profile</span>
                            </li>
                        </Link>
                        <li className="dropdownItem  ">
                            <span className="text-black cursor-pointer" onClick={(e) => {
                                e.preventDefault()
                                logoutHanlde()
                            }}>Logout</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
})
