# Vision

Welcome to the Bitform vision.
This document outlines all the goals and features that Bitform should eventually have.
The advantage of having this document is that it allows us to look towards an end goal and continue moving.

This document doesn't particularly have a specific format but should still be organized.
There is no specific way that things need to be listed as long as it follows the same general format as everything else in the document.

## Bitform

Bitform is the final product.
It will provide a simple and easy to use interface to build websites using [modules](#modules).
The overall goal for Bitform is to have an extremely extensible yet simple [API](#api).

At its most simple use-case, it should produce websites that are simple and clean.
They should be responsive and work well on any size of device.
They should also be able to work as a Progressive Web Application and be able to have the interface stripped away to work as an Electron application.

The basic end user should be able to make a website using the [provided modules](#provided-modules) in a couple of lines of code.
This website should be fully functional and have all the functionality that the user would come to expect.

A more advanced user should have the ability to fully customize all the functionality of Bitform.
This includes making their own [modules](#modules), [components](#components), and whatever else they might want to do.
This entails making nearly everything configurable.
For example, default functionality should never be the only functionality.

Bitform promotes a highly modularized workflow.
This essentially means splitting many things up into many packages, so they can be used independently of each other.
That means that it is recommended to split up larger libraries/packages into smaller individual bits and pieces.

In addition, a single instance of Bitform should be able to handle multiple different websites.
For example, running a single instance of Bitform should be able to accept requests from both `example1.com` and `example2.com` and respond with the correct page for each website.

### Modules

Modules are the building blocks of Bitform.
They define all the functionality and pages on a website.

Modules define [pages](#pages) for the website to host.

These pages should be able to be mounted on a URL path to allow separation of modules and prevent overlap.
For example, a [forum module](#forums-module) should be able to be hosted on the `/forums` path to separate it from the rest of the site.

Modules can also define [functionality](#module-functionality).
This functionality can modify how the website works and define new features that otherwise wouldn't exist without the module.

Modules should be able to be enabled in a single line.
From there, their [configuration](#module-configuration) should determine their functionality.

On their basic level, modules are the basis of all content on a Bitform website.
They are the part which defines the pages and functionality.
They can be as simple as a single landing page or as complex as an entire forum system.

Modules should all define an API that allows other modules to communicate with it.
This should allow for more functionality and richer content.
For example, a landing page should provide an API for nearly every single piece of content on it.

#### Pages

A page is a single endpoint for a website.
That is, nearly every single URL combination should get its own page.
The only exception would be for static content such as images and stylesheets.

Pages interface directly with the [router](#routing-api) to define pages.
This means that they need to take everything into account when defining an endpoint, such as the base URL.
It also means that they are responsible for setting up API routes, i.e. RESTful routes.

Page [layouts](#layouts) and [components](#components) are the building blocks of pages.
They are entirely what define the content.
A page is essentially just a stub for a route which returns the content comprised of [layouts](#layouts) and [components](#components).

##### Layouts

A layout defines the general composition of a page.
They are what define a general template for the page and nothing else.

Layouts should define a simple skeleton for a generic page, to which [components](#components) can be added.
[Components](#components) are really what adds content to a page and shoule be treated as such.
Layouts should really just define an API which can be configured if needed in addition to the components to add to the page.

A layout could be made for any single page, but should be made as generic as possible.
A single "generic" layout should be made to provide all the general functionality for pages.
Outside of that, layouts can be made, but again, should be made as generic as possible.
As with [modules](#modules), layouts should be made to have an API which can be configured as needed.

##### Components

Components are the individual building blocks of a page.
Outside of the layout, they are what provides all the necessary content of a page.

Components should be made as generic as possible.
They should essentially provide the basic shells of a part of a website then get reused as much as possible.
Any complex components should be a nest of smaller, simpler components.

Base components should be as simple as text.
They are the absolute bottom of the stack and as such should be as extensible as possible.
This allows for the most amount of customization higher up in the stack and future-proofs things a bit.

Similar to [layouts](#layouts), components should have a generic API which defines their look and feel.
Components should be able to work using different themes and styles without any configuration from higher components/layouts/pages.

A basic set of components should be provided with Bitform.
These are general base components that can be used to build any type of component higher in the stack.
Components such as basic text, forms, containers, etc. should be included in this set.

#### Module Functionality

Modules can provide extra functionality.
An example of this would be the [users module](#users-module).
Functionality is essentially any code that adds to or changes the default functionality of Bitform.

Functionality that modules can provide includes but is not limited to extra functions and variables to existing classes.
This could be extra variables to provide to pages when rendering content.
It could also be more functions to provide to routes when handling a request.

Because variables and functions get added to existing classes, it is recommended to put a specific module's related additions into a "namespace".
This essentially just means creating a single variable off of the existing class which is an instance of another class which provides all the new functions and variables.
This way, multiple modules won't create overlapping function and variable names on the classes.

While modules can provide both functionality and pages, it is recommended to split them up to provide more customization to the end user.
An example of this would be the [forums module](#forums-module).

##### Middleware

One of the main ways for modules to provide functionality is through middleware.
Middleware is a step in between two other steps.
It could be in between a request getting received and getting processed.
It could also be in between the application getting initialized and being started.

Middleware essentially just provides a module with the proper environment to be able to do what it needs to be doing.
For example, a module which adds functionality to routes would be run when the application is starting up.
A module which provides functionality to components would probably be run when components are getting rendered.

The main place for a middleware to exist is when processing a request.
Typically, this means that the middleware will be run after a request is received, but before the request is processed.
This allows for functionality to get added depending on who is making the request.

#### Module Configuration

All modules should have configuration.
This could either be configuration provided when initializing the module, configuration determined by the [configuration module](#configuration-module), or a combination of both.
The recommendation would be to support both configuration methods and give priority to the configuration module.

Configuration during initialization should generally be more advanced things which wouldn't be configurable by the configuration module.
This includes things like providing instances to variables and extra functionality functions.
However, all the configuration options made available to the configuration module should also be available during initialization.

Configuration through the configuration module allows for quicker and easier configuration.
It is done through a web interface which allows anyone with access to change options, not just the developers.
Using this approach, the module provides an API which can be used to define all the options and settings.
It also allows for options to be changed in real time.

### Provided Modules

A set of default modules should be provided with Bitform.
These are optional modules that might be common amongst websites.
If a website opts to not use any of the provided modules, they can be removed and deleted.

#### Users Module

Basic user functionality.
This is a functionality module which provides an API for users on a website.

The module will provide a fairly generic API which provides functionality for users.
This functionality includes things such as authentication, sessions, cookies, etc.
This module should provide all the necessary functionality to allow for users on a website and nothing more.

Following the recommendations for modules, this module will be as extensible as possible.
What this means is that all the functionality will be changeable.
This includes things such as encryption, user session tracking, authentication, etc.

Being that this module includes authentication, this module should be as secure as possible.
This means that every best practice should be included by default and anything else should be warned against.
Along with that, security should be monitored very closely and any vulnerabilities should be reported ASAP.

#### User Management Module

User management.
User management is essentially the UI of the [users module](#users-module).
It is all the pages which pertain to users.

The pages that should be provided by this module include logins, registers, logouts, user profiles, user settings, etc.
The module should also include an administrator dashboard.
This dashboard should allow for anything the administrator might want to do, which includes but is not limited to user management, module configuration, etc.

This module should follow the recommendations set for pages, by being as extensible as possible.
All the included pages, layouts, and components should be able to be swapped and configured with ease.
All the components on the login/register pages, dashboard pages, etc. should be extensible and exchangeable with other components.
This means that other modules should be able to add components to these pages without actually being included in the module.

#### Configuration Module

A module to facilitate the configuration of other modules.
This should add a page in the [user management dashboard](#user-management-module) which allows for configuration.
Of course, the dashboard page should only be visible to people who have proper access.

The configuration module should allow for extensive configuration of other modules.
This means that the interface should be simple and easy to understand while providing a large amount of information.

The information provided should be received through an [API](#configuration-api).
This API shouldn't be provided by this module, but used extensively by it.

#### Forums Module

A basic forum.
This module should provide all the necessary functionality for a forum.
It should be as simple as drag-and-drop to get the forum up and running.

The forum should have all the features that are common with modern forums.
This includes things like categories, roles, reputation, etc.

#### Blog Module

A blog module.
This module should provide a rich and complete blogging experience.
The module should be modeled after popular blogging software such as Ghost and Medium.

#### Store Module

A store module.
This module should essentially provide a frontend to the [store API](#store-api).
The experience should be seamless and consistent with other provided modules.

The store should allow for any type of item to be purchased.
This includes physical items that need to be shipped or digital items that can be redeemed.
Whatever the item, the end user should have the ability to efficiently run their store.

#### Wiki Module

A simple wiki module.
This should be initially modeled to provide a wiki for software projects, but be adaptable for any type of wiki content.
The experience should be consistent with the rest of the website and provide an interface that looks and feels similar to existing wiki software.

A look and feel similar to the [blog module](#blog-module) should be incorporated into this module.
That includes both the editor and the final display of the page.

#### Documentation Module

A module to provide documentation.
This module should be similar to the [wiki module](#wiki-module), but different enough to warrant a separate module.
The module should be different in that it provides functionality that feels more at-home with software developers and anyone else who might want to make documentation.
Again, this module should be modeled to work for software projects yet should adapt to any type of project.

## API

The API is an interface for Bitform.
It is defined to allow for extension of functionality.
This means that the functionality of any given part of Bitform is never constant and can be modified however needed.

The API splits up into different parts to provide a cleaner interface.
The reason for this is to keep all the different parts separate from each other.

### Routing API

The routing API is what allows for the definition of specific endpoints.
The objective is to provide a simple and clean API for anything related to routing.
This includes providing access to create a route for any type of HTTP method.

### Configuration API

The configuration API should provide an interface for creating configurations.
These configurations should be serializable for storage as well as reflection for getting information about the structure.

This API defines the interface for usage by the [configuration module](#configuration-module).
That means that it must define everything that is necessary for the configuration module to function.

### Storage API

The storage API defines an API for storing information.
The API should be generic enough for any type of information to be stored.
It should also be generic enough for any type of backend to implement it.

The goal is to support nearly every common database format as well as some other generic storage types.
The generic storage types include but aren't limited to in-memory storage, YAML files, JSON files, etc.

### Store API

A non-default API behind the [store module](#store-module).
This API should define all the interfaces and whatnot to allow the store module to function properly.
The API should be made as extensible as possible to allow any type of functionality for stores.

Any type of item should be able to be purchased from this type of store.
That means that physical items should be able to be purchased, notifying the seller that an order has been made.
It also means that digital items should be able to be purchased, handling whatever logic must go into delivering the product to the buyer.
On top of that, those two shouldn't be the only types of products that can be purchased.
The API should allow for other types of products to be purchased as well.

Given that this API deals with money, it must be extremely secure.
As with the [users module](#users-module), this API should follow all the best practices and closely monitor for security issues.

## Bitform Cloud

Once Bitform is working in a deployable state, Bitform Cloud should be the first official application to support Bitform.
The idea behind Bitform Cloud is similar to [Ghost's](https://ghost.org/) business model.
That is, offering all the source code completely free then offering a paid, hosted option that includes official support.

The idea is that we provide Bitform completely open source and free of charge.
We then offer a paid option to host websites on our own servers and provide official support with any issues for a small fee.

Following this model, we can provide a free and open source product while still receiving a stream of revenue to fund the continued development of the product.
According to [Ghost](https://ghost.org/changelog/3-0/), they have made $5,000,000 in revenue whilst maintaining 100% ownership of their business.
The goal is to follow this model, at least in the beginning.

By offering Bitform Cloud, we can receive revenue for Bitform without having to make it closed source or making Bitform itself paid.
This model closely follows the philosophies of Bitmodo and will provide us with funding in the early days, so we can continue development.

---

Bitform Cloud will most likely be hosted on the same cloud infrastructure that hosts all the Bitmodo services.
This means that Bitform Cloud will ideally be hosted using [Kubernetes](https://kubernetes.io/) on a [Digital Ocean](https://www.digitalocean.com/) cluster.

Ideally, all Bitform Cloud websites will be hosted using a single instance of Bitform per [pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/).
This means that each website would share resources and modules.
The fact that all websites share resources means that only a small set of "standard" modules would be provided to ensure security and stability.

A single Bitform Cloud module would be responsible for the actual logic (or technically 2 for functionality and interface).
This module will handle all the necessary separation of each website as well as provide the management dashboard.

The management dashboard will be the destination for users to manage their website.
There, they will be able to enable and disable modules, change configuration options, manage their payment options, etc.

Eventually, it would be nice to provide a tier that allows users to make advanced Bitform websites.
This means that they would be able to configure all the modules that are installed, including third-party ones.
To provide this tier, the websites would need to be sandboxed, potentially using virtualization or [Docker](https://www.docker.com/).
