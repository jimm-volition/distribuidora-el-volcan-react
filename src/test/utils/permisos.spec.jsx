import { destinoDespuesDeIngresar, puedeVer } from "../../utils/permisos";

describe("puedeVer", () => {
  it("solo ADMIN entra a la administracion", () => {
    expect(puedeVer("/admin/productos", "ADMIN")).toBe(true);
    expect(puedeVer("/admin/categorias", "CLIENTE")).toBe(false);
    expect(puedeVer("/admin/productos", "VENDEDOR")).toBe(false);
  });

  it("la operadora no entra a pedido, nosotros ni contacto", () => {
    expect(puedeVer("/pedido", "VENDEDOR")).toBe(false);
    expect(puedeVer("/contacto", "VENDEDOR")).toBe(false);
    expect(puedeVer("/pedido", "CLIENTE")).toBe(true);
  });

  it("las rutas publicas las ve cualquiera", () => {
    expect(puedeVer("/catalogo/CL001", "VENDEDOR")).toBe(true);
    expect(puedeVer("/", "CLIENTE")).toBe(true);
  });

  it("no confunde rutas que solo empiezan igual", () => {
    expect(puedeVer("/administracion-publica", "CLIENTE")).toBe(true);
  });
});

describe("destinoDespuesDeIngresar", () => {
  it("vuelve a la pagina pedida si el rol puede verla", () => {
    expect(destinoDespuesDeIngresar("/ordenes", "CLIENTE")).toBe("/ordenes");
    expect(destinoDespuesDeIngresar("/admin/categorias", "ADMIN")).toBe("/admin/categorias");
  });

  it("si el rol no puede verla, va a su pagina de inicio", () => {
    expect(destinoDespuesDeIngresar("/admin/productos", "CLIENTE")).toBe("/catalogo");
    expect(destinoDespuesDeIngresar("/pedido", "VENDEDOR")).toBe("/ordenes");
  });

  it("sin pagina pedida, va al inicio de cada rol", () => {
    expect(destinoDespuesDeIngresar(undefined, "ADMIN")).toBe("/admin/productos");
    expect(destinoDespuesDeIngresar(undefined, "VENDEDOR")).toBe("/ordenes");
    expect(destinoDespuesDeIngresar(undefined, "CLIENTE")).toBe("/catalogo");
  });
});
