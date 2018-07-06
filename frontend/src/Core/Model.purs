module Core.Model where

import Core.Prelude

import Data.String as String

type Language =
    { languageCode :: String
    , endonym :: String
    , languageName :: String
    }

type Talk =
    { id :: Int
    , slug :: String
    , image :: String
    , name :: String
    , languages :: Array Language
    , description :: String
    , mediaSlug :: String
    -- , publishedAt :: Maybe Date.Date
    }

getTitleSpeaker :: Talk -> Tuple String String
getTitleSpeaker talk =
  case String.split (String.Pattern ":") talk.name of
    [speaker, title] -> Tuple title speaker
    _ -> Tuple "" talk.name
