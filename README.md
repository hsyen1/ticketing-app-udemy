# This is the root module of the Ticketing system app (from Udemy by Stephen Grider)

## This is a personal project is currently WIP.

This repo consists of 2 folder structure as of writing (as of 01/07/2022):

1. auth: a service to allow users to register and to sign-in/out.

- uses MongoDB image from docker hub as a temporary memory store (will switch to Mongo Atlas as the project progresses)
- consists of middlewares to perform auth checks and standardized error response
- deployed in a k8 cluster in GCP's code build via skaffold (currently free trial has expired, need to setup to run in local instead)

2. infra

- consists of all the k8s config

\*\*More services will be added in the future including tests
