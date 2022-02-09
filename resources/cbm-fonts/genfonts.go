/*
 * Copyright (c) 2022 Andreas Signer <asigner@gmail.com>
 *
 * This file is part of cbm-font-editor.
 *
 * cbm-font-editor is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * cbm-font-editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with cbm-font-editor.  If not, see <http://www.gnu.org/licenses/>.
 */

// This program generates the EmbeddedFonts.js javascript source.
//
// Run it with 'go run genfonts.go'
//
package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

type font struct {
	name string
	data []byte
}

var fonts []font

func genFont(f font) string {
	var data []string
	for _, b := range f.data {
		data = append(data, fmt.Sprintf("0x%02x", b))
	}
	return fmt.Sprintf(`  {
    name: %q,
    data: new Uint8Array([%s])
  },`, f.name, strings.Join(data, ","))
}

func main() {
	buf, _ := ioutil.ReadFile("C128/chargen")
	//fonts = append(fonts, font{"C128 Intl 001", buf[0:2048]})
	//fonts = append(fonts, font{"C128 Intl 002", buf[2048:4096]})
	fonts = append(fonts, font{"C128 UC", buf[4096:6144]})
	fonts = append(fonts, font{"C128 LC", buf[6144:8192]})

	buf, _ = ioutil.ReadFile("C128/chargch")
	fonts = append(fonts, font{"C128 Swiss UC", buf[4096:6144]})
	fonts = append(fonts, font{"C128 Swiss LC", buf[6144:8192]})
	fonts = append(fonts, font{"C128 Swiss DIN UC", buf[0:2048]})
	fonts = append(fonts, font{"C128 Swiss DIN LC", buf[2048:4096]})

	buf, _ = ioutil.ReadFile("C128/chargde")
	fonts = append(fonts, font{"C128 German UC", buf[0:2048]})
	fonts = append(fonts, font{"C128 German LC", buf[2048:4096]})
	fonts = append(fonts, font{"C128 German DIN UC", buf[4096:6144]})
	fonts = append(fonts, font{"C128 German DIN LC", buf[6144:8192]})

	fonts = append(fonts, font{"", []byte{}})

	buf, _ = ioutil.ReadFile("C64/chargen")
	fonts = append(fonts, font{"C64 UC", buf[0:2048]})
	fonts = append(fonts, font{"C64 LC", buf[2048:4096]})

	fonts = append(fonts, font{"", []byte{}})

	buf, _ = ioutil.ReadFile("PET/characters.901640-01.bin")
	fonts = append(fonts, font{"SuperPET ASCII", buf[2048:4096]})

	buf, _ = ioutil.ReadFile("PET/characters-2.901447-10.bin")
	fonts = append(fonts, font{"PET", buf[0:2048]})

	buf, _ = ioutil.ReadFile("PET/chargen.de")
	fonts = append(fonts, font{"PET German", buf[0:2048]})

	fonts = append(fonts, font{"", []byte{}})

	buf, _ = ioutil.ReadFile("VIC20/chargen")
	fonts = append(fonts, font{"VIC-20 UC", buf[0:2048]})
	fonts = append(fonts, font{"VIC-20 LC", buf[2048:4096]})

	buf, _ = ioutil.ReadFile("VIC20/chargen-jp")
	fonts = append(fonts, font{"VIC-20 Japanese UC", buf[0:2048]})
	fonts = append(fonts, font{"VIC-20 Japanese LC", buf[2048:4096]})

	content := `/*
 * Copyright (c) 2022 Andreas Signer <asigner@gmail.com>
 *
 * This file is part of cbm-font-editor.
 *
 * cbm-font-editor is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * cbm-font-editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with cbm-font-editor.  If not, see <http://www.gnu.org/licenses/>.
 */

// GENERATED FILE, DO NOT EDIT
var EmbeddedFonts = [
`
	for _, f := range fonts {
		content = content + genFont(f)
	}
	content += `]
export default EmbeddedFonts;
`

	ioutil.WriteFile("../../src/EmbeddedFonts.js", []byte(content), 0644)
}
