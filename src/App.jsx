import { createContext, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeForms from './HomeForms/homeForms';
import styles from './App.module.css';
import './App.css';
import ScrollToTop from './utils/ScrollToTop';
import CampaignContainer from './Campaign/CampaignContainer';
import CharacterList from './Character/characterList';
import CampaignPage from './Campaign/CampaignPage';
import CharacterDetails from './Character/CharacterDetails';
import CharacterForm from './Character/CharacterForm';
import UpdateCharacterForm from './Character/UpdateCharacterForm';
import WriteUpList from './WriteUp/WriteUpList';
import WriteUpDetail from './WriteUp/WriteUpDetail';
import WriteUpForm from './WriteUp/WriteUpForm';
import NpcForm from './Npc/NpcForm';
import NpcList from './Npc/NpcList';
import NpcDetails from './Npc/NpcDetails';
import UpdateNpcForm from './Npc/UpdateNpcForm.jsx';
import QuestForm from './Quests/QuestForm';
import QuestDetails from './Quests/QuestDetails';
import QuestList from './Quests/QuestList';
import UpdateQuestForm from './Quests/UpdateQuestForm';
import LocationForm from './Location/LocationForm';
import LocationList from './Location/LocationList';
import LocationDetails from './Location/LocationDetails';
import NotableGroupForm from './NotableGroup/NotableGroupForm';
import NotableGroupList from './NotableGroup/NotableGroupList';
import NotableGroupDetails from './NotableGroup/NotableGroupDetails';
import UpdateNotableGroupForm from './NotableGroup/UpdateNotableGroupForm';

const client = new ApolloClient({
  uri: import.meta.env.PROD
    ? 'https://glacial-citadel-97121.herokuapp.com/graphql'
    : 'http://localhost:3000/graphql',
  headers: {
    accessToken: localStorage.getItem('access-token'),
    client: localStorage.getItem('client'),
    uid: localStorage.getItem('uid'),
  },
  cache: new InMemoryCache(),
});

export const AuthContext = createContext(null);

const App = () => {
  const loggedIn = localStorage.getItem('loginStatus');
  const [authState, setAuthState] = useState({
    loggedIn: loggedIn ? true : false,
  });

  const logout = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
    localStorage.removeItem('loginStatus');
    setAuthState({ loggedIn: false });
    window.location.href = '/';
  };

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <ScrollToTop />
          <nav className={styles.navbar}>
            <ul>
              {!authState.loggedIn && (
                <li>
                  <Link to="/">Home</Link>
                </li>
              )}
              {authState.loggedIn && (
                <li>
                  <Link to="/campaigns">Campaigns</Link>
                </li>
              )}
            </ul>
            {authState.loggedIn && (
              <button className={styles.logoutButton} onClick={logout}>
                Logout
              </button>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<HomeForms />}></Route>
            <Route path="/campaigns" element={<CampaignPage />}></Route>
            <Route
              path="/campaigns/:campaign_name/"
              element={<CampaignContainer />}
            >
              <Route path="characters/" element={<CharacterList />}></Route>
              <Route path="characters/new" element={<CharacterForm />} />
              <Route
                path="characters/:character_name"
                element={<CharacterDetails />}
              />
              <Route
                path="characters/:character_name/edit"
                element={<UpdateCharacterForm />}
              />
              <Route path="write-ups/" element={<WriteUpList />}></Route>
              <Route path="write-ups/new" element={<WriteUpForm />} />
              <Route
                path="write-ups/:session_number"
                element={<WriteUpDetail />}
              />
              <Route path="npcs/" element={<NpcList />}></Route>
              <Route path="npcs/new" element={<NpcForm />}></Route>
              <Route path="npcs/:npc_name" element={<NpcDetails />} />
              <Route
                path="npcs/:npc_name/edit"
                element={<UpdateNpcForm />}
              ></Route>
              <Route path="quests" element={<QuestList />}></Route>
              <Route path="quests/new" element={<QuestForm />}></Route>
              <Route
                path="quests/:quest_title"
                element={<QuestDetails />}
              ></Route>
              <Route
                path="quests/:quest_title/edit"
                element={<UpdateQuestForm />}
              ></Route>
              <Route path="locations" element={<LocationList />}></Route>
              <Route path="locations/new" element={<LocationForm />}></Route>
              <Route
                path="locations/:location_name"
                element={<LocationDetails />}
              ></Route>
              <Route
                path="notablegroups"
                element={<NotableGroupList />}
              ></Route>
              <Route
                path="notablegroups/new"
                element={<NotableGroupForm />}
              ></Route>
              <Route
                path="notablegroups/:group_name"
                element={<NotableGroupDetails />}
              ></Route>
              <Route
                path="notablegroups/:group_name/edit"
                element={<UpdateNotableGroupForm />}
              ></Route>
              {/* <Route path="write-ups" element={<CharacterList />}></Route> */}
            </Route>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default App;
