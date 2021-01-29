![CreateLogo](https://image.ibb.co/nfT01G/create_logo_two.png)

***Create*** *is an explorative movement within Bang & Olufsen. Our mission is to inspire and be inspired by the global creative community.*

# Beocreate 2

***Beocreate 2*** is the software suite for *Beocreate 4-Channel Amplifier*. It replaces the old setup tool and system software shipped with the *ReCreate* project in 2018. It has been redesigned from the ground up to be more flexible, more reliable and future-proof. 

***Beocreate Connect*** is a new companion application (for Mac + Windows) that automatically and instantly discovers all Beocreate 2 sound systems on the network, without typing a single IP address.

Beocreate 2 is bundled with [ausionOS](https://github.com/ausion/ausion-os) as its official user interface. On systems that use other ausion sound cards, the user interface carries ausion branding.

## Main Features

- A flexible front-end for Beocreate 4-Channel Amplifier and other ausion sound cards.
- Upcycle vintage Bang & Olufsen speakers or build your own, custom sound system.
- Beautifully crafted, responsive, browser-based user interface that works within the local network. Dark mode is supported.
- See what's playing, control playback and volume.
- Supports multiple sources/streaming protocols that can be set up in one place (powered by [ausion AudioControl](https://github.com/ausion/audiocontrol2)).
- Speaker presets designed by Bang & Olufsen acousticians specifically for select loudspeaker models.
- Quickly customise the sound with Beosonic and listening modes.
- Parametric equaliser for general sound design and each output channel – ideal for crossovers and tuning custom loudspeakers.
- Manage Wi-Fi and Ethernet connections.
- Extension architecture for easy expandability and future-proofing.
- Based on Node.js.

## Getting Started

### Beocreate 2

As Beocreate 2 is part of ausionOS, the recommended way is to download the latest image of ausionOS for your Raspberry Pi generation and write it to a microSD card. [Get ausionOS](https://www.ausion.com/ausionos/)

Alternatively, you can use the Buildroot system to build ausionOS yourself. [Building ausionOS](https://github.com/ausion/ausion-os/blob/master/doc/building.md)

Once installed, you can follow instructions in Beocreate Connect set up the sound system.

### Beocreate Connect

Beocreate Connect is based on Electron, and you can run it using the following instructions:

1. [Install Node.js](https://nodejs.org/en/) on your Mac or Windows computer.
2. Clone or download the *bang-olufsen/create* repository.
3. In your terminal application, navigate to the *BeocreateConnect* folder and run `npm install` to download and install Electron and other dependencies.
4. Once installed, type `npm start` to start Beocreate Connect.

## Help

[Visit the wiki](https://github.com/bang-olufsen/create/wiki) for help.

## Documentation

We're working to add documentation for Beocreate 2 to make it easier to tap into its expandability.

### Extensions

Design and develop extensions to expand the functionality of the system.

- [Introduction to Extensions](Documentation/ExtensionsIntroduction.md)
- [Implementing Server-side Code](Documentation/ExtensionsServer.md)
- Implementing User Interface

### Sound & Customisation

Create speaker presets, DSP programs and product identities to customise the sound system.

- [Speaker Presets](Documentation/SoundPresets.md)
- DSP Programs
- [Product Identities](Documentation/ProductIdentities.md)

### Design

Guidelines and best practices for design within Beocreate 2 ecosystem.

- [Beocreate 2 Design Guidelines](Documentation/DesignGuidelines.md)


## Known Issues

Some issues in the current release that aren't acknowledged in the user interface:

(No current issues)


## Legacy Code

The original code for the project (SigmaTCPDaemon, SigmaClientTool Beocreate Server and the bang-olufsen.com-based setup tool) has been archived under the [beocreate1](https://github.com/bang-olufsen/create/tree/beocreate1) branch.

The old DSP programs are in the *Speakers* directory, but please note that these aren't fully compatible with Beocreate 2. Beocreate 2 comes built in with the speaker presets for these models.